const Hostel = require('../models/Hostel');
const Room = require('../models/Room');

// List all hostels
exports.index = async (req, res) => {
  try {
    const hostels = await Hostel.find().sort({ createdAt: -1 }).lean();

    // Get room counts for each hostel
    for (let hostel of hostels) {
      const rooms = await Room.find({ hostelId: hostel._id }).lean();
      hostel.roomCount = rooms.length;
      hostel.availableRooms = rooms.filter(r => r.status === 'available').length;
      hostel.occupiedRooms = rooms.filter(r => r.status === 'full').length;
    }

    res.render('hostels/index', { title: 'Hostels', hostels, query: req.query });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load hostels');
    res.redirect('/');
  }
};

// Show single hostel
exports.show = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).lean();
    if (!hostel) {
      req.flash('error', 'Hostel not found');
      return res.redirect('/hostels');
    }
    const rooms = await Room.find({ hostelId: hostel._id }).sort({ floor: 1, roomNumber: 1 }).lean();
    res.render('hostels/show', { title: hostel.name, hostel, rooms });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load hostel');
    res.redirect('/hostels');
  }
};

// Render add hostel form
exports.addForm = (req, res) => {
  res.render('hostels/add', { title: 'Add Hostel' });
};

// Create hostel
exports.create = async (req, res) => {
  try {
    const { name, address, totalRooms, type, wardenName, wardenContact } = req.body;
    await Hostel.create({
      name,
      address,
      totalRooms: parseInt(totalRooms),
      type,
      warden: { name: wardenName, contact: wardenContact }
    });
    req.flash('success', 'Hostel added successfully');
    res.redirect('/hostels');
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Failed to add hostel');
    res.redirect('/hostels/add');
  }
};

// Render edit hostel form
exports.editForm = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).lean();
    if (!hostel) {
      req.flash('error', 'Hostel not found');
      return res.redirect('/hostels');
    }
    res.render('hostels/edit', { title: 'Edit Hostel', hostel });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load hostel');
    res.redirect('/hostels');
  }
};

// Update hostel
exports.update = async (req, res) => {
  try {
    const { name, address, totalRooms, type, wardenName, wardenContact } = req.body;
    await Hostel.findByIdAndUpdate(req.params.id, {
      name,
      address,
      totalRooms: parseInt(totalRooms),
      type,
      warden: { name: wardenName, contact: wardenContact }
    });
    req.flash('success', 'Hostel updated successfully');
    res.redirect(`/hostels/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Failed to update hostel');
    res.redirect(`/hostels/${req.params.id}/edit`);
  }
};

// Delete hostel
exports.delete = async (req, res) => {
  try {
    await Room.deleteMany({ hostelId: req.params.id });
    await Hostel.findByIdAndDelete(req.params.id);
    req.flash('success', 'Hostel deleted successfully');
    res.redirect('/hostels');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete hostel');
    res.redirect('/hostels');
  }
};
