const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Student = require('../models/Student');
const HostelAllocation = require('../models/HostelAllocation');
const Complaint = require('../models/Complaint');

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      totalStudents,
      totalRooms,
      availableRooms,
      activeAllocations,
      openComplaints,
      resolvedThisMonth,
      allAllocations,
      recentComplaints,
      hostels
    ] = await Promise.all([
      Student.countDocuments(),
      Room.countDocuments(),
      Room.countDocuments({ status: 'available' }),
      HostelAllocation.countDocuments({ status: 'active' }),
      Complaint.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
      Complaint.countDocuments({
        status: 'resolved',
        resolvedOn: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      HostelAllocation.find({ status: 'active' }).populate('studentId').lean(),
      Complaint.find().sort({ raisedOn: -1 }).limit(5)
        .populate('studentId', 'name studentId')
        .populate('hostelId', 'name')
        .lean(),
      Hostel.find().lean()
    ]);

    // Calculate fees collected this month
    let feesThisMonth = 0;
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    for (const alloc of allAllocations) {
      for (const fee of alloc.feesPaid || []) {
        if (fee.month === currentMonthName && fee.year === currentYear) {
          feesThisMonth += fee.amount;
        }
      }
    }

    // Get all allocations for fee calculation
    const allActiveAllocations = await HostelAllocation.find({ status: 'active' })
      .populate('studentId').lean();

    res.render('dashboard', {
      title: 'Dashboard',
      stats: {
        totalStudents,
        totalRooms,
        availableRooms,
        activeAllocations,
        feesThisMonth,
        openComplaints,
        resolvedThisMonth
      },
      recentComplaints,
      hostels
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    req.flash('error', 'Failed to load dashboard data');
    res.render('dashboard', {
      title: 'Dashboard',
      stats: {
        totalStudents: 0, totalRooms: 0, availableRooms: 0,
        activeAllocations: 0, feesThisMonth: 0, openComplaints: 0, resolvedThisMonth: 0
      },
      recentComplaints: [],
      hostels: []
    });
  }
};
