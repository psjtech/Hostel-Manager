const HostelAllocation = require('../models/HostelAllocation');
const Student = require('../models/Student');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');

// List all allocations
exports.index = async (req, res) => {
  try {
    const { hostel, status, roomType, search } = req.query;
    let filter = {};

    if (hostel) filter.hostelId = hostel;
    if (status) filter.status = status;

    let allocations = await HostelAllocation.find(filter)
      .populate('studentId')
      .populate('roomId')
      .populate('hostelId', 'name')
      .sort({ allocationDate: -1 })
      .lean();

    // Filter by roomType (post-populate)
    if (roomType) {
      allocations = allocations.filter(a => a.roomId && a.roomId.roomType === roomType);
    }

    // Search by student name
    if (search) {
      const searchLower = search.toLowerCase();
      allocations = allocations.filter(a =>
        (a.studentId && a.studentId.name.toLowerCase().includes(searchLower)) ||
        (a.studentId && a.studentId.studentId.toLowerCase().includes(searchLower))
      );
    }

    const hostels = await Hostel.find().lean();

    res.json({ success: true, data: { allocations, hostels } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load allocations' });
  }
};

// Show single allocation
exports.show = async (req, res) => {
  try {
    const allocation = await HostelAllocation.findById(req.params.id)
      .populate('studentId')
      .populate('roomId')
      .populate('hostelId')
      .lean();

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    res.json({ success: true, data: allocation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load allocation' });
  }
};

// Get form data for creating allocation
exports.formData = async (req, res) => {
  try {
    const activeStudentIds = await HostelAllocation.find({ status: 'active' }).distinct('studentId');
    const students = await Student.find({ _id: { $nin: activeStudentIds } }).sort({ name: 1 }).lean();
    const hostels = await Hostel.find().lean();
    const rooms = await Room.find({ status: 'available' }).populate('hostelId', 'name').sort({ roomNumber: 1 }).lean();

    res.json({ success: true, data: { students, hostels, rooms } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load form data' });
  }
};

// Create allocation
exports.create = async (req, res) => {
  try {
    const { studentId, roomId, hostelId, allocationDate } = req.body;

    // Check: student must not already have an active allocation
    const existing = await HostelAllocation.findOne({ studentId, status: 'active' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This student already has an active room allocation' });
    }

    // Check room capacity
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Selected room not found' });
    }
    if (room.occupiedCount >= room.capacity) {
      return res.status(400).json({ success: false, message: 'Selected room is already full' });
    }

    // Calculate totalFeesDue (months from allocation to current)
    const allocDate = new Date(allocationDate || Date.now());
    const now = new Date();
    const monthsDiff = (now.getFullYear() - allocDate.getFullYear()) * 12 + (now.getMonth() - allocDate.getMonth()) + 1;
    const totalFeesDue = Math.max(1, monthsDiff) * room.monthlyFee;

    // Create allocation
    const allocation = await HostelAllocation.create({
      studentId,
      roomId,
      hostelId: hostelId || room.hostelId,
      allocationDate: allocDate,
      totalFeesDue,
      totalFeesPaid: 0
    });

    // Update room occupiedCount
    room.occupiedCount += 1;
    if (room.occupiedCount >= room.capacity) {
      room.status = 'full';
    }
    await room.save();

    res.status(201).json({ success: true, data: allocation, message: 'Room allocated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to allocate room' });
  }
};

// Vacate a room
exports.vacate = async (req, res) => {
  try {
    const allocation = await HostelAllocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    allocation.status = 'vacated';
    allocation.vacatingDate = new Date();
    await allocation.save();

    // Update room occupiedCount
    const room = await Room.findById(allocation.roomId);
    if (room) {
      room.occupiedCount = Math.max(0, room.occupiedCount - 1);
      if (room.occupiedCount < room.capacity && room.status === 'full') {
        room.status = 'available';
      }
      await room.save();
    }

    res.json({ success: true, message: 'Room vacated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to vacate room' });
  }
};

// Record a fee payment
exports.recordPayment = async (req, res) => {
  try {
    const { month, year, amount } = req.body;
    const allocation = await HostelAllocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    // Generate receipt number
    const receiptNo = 'RCP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    allocation.feesPaid.push({
      month,
      year: parseInt(year),
      amount: parseFloat(amount),
      paidOn: new Date(),
      receiptNo
    });

    allocation.totalFeesPaid = allocation.feesPaid.reduce((sum, f) => sum + f.amount, 0);
    await allocation.save();

    res.json({ success: true, data: { receiptNo }, message: `Payment recorded successfully. Receipt: ${receiptNo}` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Failed to record payment' });
  }
};

// Fee summary page
exports.feeSummary = async (req, res) => {
  try {
    const allocations = await HostelAllocation.find({ status: 'active' })
      .populate('studentId')
      .populate('roomId')
      .populate('hostelId', 'name')
      .lean();

    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    // Check overdue status
    const summary = allocations.map(alloc => {
      const currentMonthPaid = alloc.feesPaid.some(
        f => f.month === currentMonth && f.year === currentYear
      );
      return {
        ...alloc,
        isOverdue: !currentMonthPaid,
        balance: alloc.totalFeesDue - alloc.totalFeesPaid
      };
    });

    res.json({
      success: true,
      data: { summary, currentMonth, currentYear }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load fee summary' });
  }
};
