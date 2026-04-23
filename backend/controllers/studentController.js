const Student = require('../models/Student');
const HostelAllocation = require('../models/HostelAllocation');
const Complaint = require('../models/Complaint');

// List all students
exports.index = async (req, res) => {
  try {
    const { search, course, year } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (course) filter.course = { $regex: course, $options: 'i' };
    if (year) filter.year = parseInt(year);

    const students = await Student.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load students' });
  }
};

// Show single student
exports.show = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const allocations = await HostelAllocation.find({ studentId: student._id })
      .populate('roomId')
      .populate('hostelId', 'name')
      .sort({ allocationDate: -1 })
      .lean();

    const complaints = await Complaint.find({ studentId: student._id })
      .populate('hostelId', 'name')
      .sort({ raisedOn: -1 })
      .lean();

    res.json({ success: true, data: { student, allocations, complaints } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load student' });
  }
};

// Create student
exports.create = async (req, res) => {
  try {
    const { name, email, phone, studentId, course, year, parentContact, address } = req.body;
    const student = await Student.create({
      name, email, phone, studentId: studentId.trim(),
      course, year: parseInt(year), parentContact, address
    });
    res.status(201).json({ success: true, data: student, message: 'Student added successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A student with this ID already exists' });
    }
    res.status(400).json({ success: false, message: err.message || 'Failed to add student' });
  }
};

// Update student
exports.update = async (req, res) => {
  try {
    const { name, email, phone, studentId, course, year, parentContact, address } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, {
      name, email, phone, studentId: studentId.trim(),
      course, year: parseInt(year), parentContact, address
    }, { new: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student, message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to update student' });
  }
};

// Delete student
exports.delete = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
};
