const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const HostelAllocation = require('../models/HostelAllocation');

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

    res.render('complaints/index', {
      title: 'Complaints',
      complaints,
      hostels,
      query: req.query,
      stats: { totalOpen, totalInProgress, resolvedThisMonth }
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load complaints');
    res.redirect('/');
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
      req.flash('error', 'Complaint not found');
      return res.redirect('/complaints');
    }

    res.render('complaints/show', { title: complaint.title, complaint });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load complaint');
    res.redirect('/complaints');
  }
};

// Render add complaint form
exports.addForm = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }).lean();
    const hostels = await Hostel.find().lean();
    const rooms = await Room.find().populate('hostelId', 'name').sort({ roomNumber: 1 }).lean();

    res.render('complaints/add', { title: 'Raise Complaint', students, hostels, rooms });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load form');
    res.redirect('/complaints');
  }
};

// Create complaint
exports.create = async (req, res) => {
  try {
    const { studentId, hostelId, roomId, title, description, category, priority } = req.body;
    await Complaint.create({
      studentId, hostelId, roomId, title, description, category, priority
    });
    req.flash('success', 'Complaint raised successfully');
    res.redirect('/complaints');
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Failed to raise complaint');
    res.redirect('/complaints/add');
  }
};

// Update complaint status
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      req.flash('error', 'Complaint not found');
      return res.redirect('/complaints');
    }

    complaint.status = status;
    if (adminRemarks) complaint.adminRemarks = adminRemarks;
    if (status === 'resolved' || status === 'closed') {
      complaint.resolvedOn = new Date();
    }
    await complaint.save();

    req.flash('success', `Complaint status updated to "${status}"`);
    res.redirect(`/complaints/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update complaint');
    res.redirect(`/complaints/${req.params.id}`);
  }
};

// Delete complaint
exports.delete = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    req.flash('success', 'Complaint deleted successfully');
    res.redirect('/complaints');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete complaint');
    res.redirect('/complaints');
  }
};
