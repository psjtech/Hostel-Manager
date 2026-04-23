const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');

// List all complaints with filters
exports.index = async (req, res) => {
  try {
    const { status, category, priority, hostel, search } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (hostel) filter.hostelId = hostel;

    let complaints = await Complaint.find(filter)
      .populate('studentId', 'name studentId')
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ raisedOn: -1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      complaints = complaints.filter(c =>
        c.title.toLowerCase().includes(s) ||
        (c.studentId && c.studentId.name.toLowerCase().includes(s))
      );
    }

    // Stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [totalOpen, totalInProgress, resolvedThisMonth] = await Promise.all([
      Complaint.countDocuments({ status: 'open' }),
      Complaint.countDocuments({ status: 'in-progress' }),
      Complaint.countDocuments({
        status: { $in: ['resolved', 'closed'] },
        resolvedOn: { $gte: startOfMonth }
      })
    ]);

    const hostels = await Hostel.find().lean();

    res.json({
      success: true,
      data: {
        complaints,
        hostels,
        stats: { totalOpen, totalInProgress, resolvedThisMonth }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load complaints' });
  }
};

// Show single complaint
exports.show = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId')
      .populate('hostelId')
      .populate('roomId')
      .lean();

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load complaint' });
  }
};

// Get form data for creating complaint
exports.formData = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }).lean();
    const hostels = await Hostel.find().lean();
    const rooms = await Room.find().populate('hostelId', 'name').sort({ roomNumber: 1 }).lean();

    res.json({ success: true, data: { students, hostels, rooms } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load form data' });
  }
};

// Create complaint
exports.create = async (req, res) => {
  try {
    const { studentId, hostelId, roomId, title, description, category, priority } = req.body;
    const complaint = await Complaint.create({
      studentId, hostelId, roomId, title, description, category, priority
    });
    res.status(201).json({ success: true, data: complaint, message: 'Complaint raised successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to raise complaint' });
  }
};

// Update complaint status
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (adminRemarks) complaint.adminRemarks = adminRemarks;
    if (status === 'resolved' || status === 'closed') {
      complaint.resolvedOn = new Date();
    }
    await complaint.save();

    res.json({ success: true, message: `Complaint status updated to "${status}"` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Failed to update complaint' });
  }
};

// Delete complaint
exports.delete = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete complaint' });
  }
};
