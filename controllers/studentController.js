const Student = require('../models/Student');

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
    res.render('students/index', { title: 'Students', students, query: req.query });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load students');
    res.redirect('/');
  }
};

// Show single student
exports.show = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      req.flash('error', 'Student not found');
      return res.redirect('/students');
    }

    const HostelAllocation = require('../models/HostelAllocation');
    const allocations = await HostelAllocation.find({ studentId: student._id })
      .populate('roomId')
      .populate('hostelId', 'name')
      .sort({ allocationDate: -1 })
      .lean();

    const Complaint = require('../models/Complaint');
    const complaints = await Complaint.find({ studentId: student._id })
      .populate('hostelId', 'name')
      .sort({ raisedOn: -1 })
      .lean();

    res.render('students/show', { title: student.name, student, allocations, complaints });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load student');
    res.redirect('/students');
  }
};

// Render add student form
exports.addForm = (req, res) => {
  res.render('students/add', { title: 'Add Student' });
};

// Create student
exports.create = async (req, res) => {
  try {
    const { name, email, phone, studentId, course, year, parentContact, address } = req.body;
    await Student.create({
      name, email, phone, studentId: studentId.trim(),
      course, year: parseInt(year), parentContact, address
    });
    req.flash('success', 'Student added successfully');
    res.redirect('/students');
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      req.flash('error', 'A student with this ID already exists');
    } else {
      req.flash('error', err.message || 'Failed to add student');
    }
    res.redirect('/students/add');
  }
};

// Render edit student form
exports.editForm = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      req.flash('error', 'Student not found');
      return res.redirect('/students');
    }
    res.render('students/edit', { title: 'Edit Student', student });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load student');
    res.redirect('/students');
  }
};

// Update student
exports.update = async (req, res) => {
  try {
    const { name, email, phone, studentId, course, year, parentContact, address } = req.body;
    await Student.findByIdAndUpdate(req.params.id, {
      name, email, phone, studentId: studentId.trim(),
      course, year: parseInt(year), parentContact, address
    });
    req.flash('success', 'Student updated successfully');
    res.redirect(`/students/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Failed to update student');
    res.redirect(`/students/${req.params.id}/edit`);
  }
};

// Delete student
exports.delete = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    req.flash('success', 'Student deleted successfully');
    res.redirect('/students');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete student');
    res.redirect('/students');
  }
};
