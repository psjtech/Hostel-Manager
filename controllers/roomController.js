const Room = require('../models/Room');
const Hostel = require('../models/Hostel');

// List all rooms with filters
exports.index = async (req, res) => {
  try {
    const { hostel, status, roomType, search } = req.query;
    let filter = {};

    if (hostel) filter.hostelId = hostel;
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;
    if (search) filter.roomNumber = { $regex: search, $options: 'i' };

    const rooms = await Room.find(filter)
      .populate('hostelId', 'name')
      .sort({ roomNumber: 1 })
      .lean();

    const hostels = await Hostel.find().lean();

    res.render('rooms/index', { title: 'Rooms', rooms, hostels, query: req.query });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load rooms');
    res.redirect('/');
  }
};

// Show single room
exports.show = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostelId').lean();
    if (!room) {
      req.flash('error', 'Room not found');
      return res.redirect('/rooms');
    }
    res.render('rooms/show', { title: `Room ${room.roomNumber}`, room });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load room');
    res.redirect('/rooms');
  }
};

// Render add room form
exports.addForm = async (req, res) => {
  try {
    const hostels = await Hostel.find().lean();
    res.render('rooms/add', { title: 'Add Room', hostels });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load form');
    res.redirect('/rooms');
  }
};

// Create room
exports.create = async (req, res) => {
  try {
    const { hostelId, roomNumber, floor, capacity, roomType, monthlyFee, status } = req.body;
    await Room.create({
      hostelId,
      roomNumber: roomNumber.trim(),
      floor: parseInt(floor),
      capacity: parseInt(capacity),
      roomType,
      monthlyFee: parseFloat(monthlyFee),
      status: status || 'available'
    });
    req.flash('success', 'Room added successfully');
    res.redirect('/rooms');
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Failed to add room');
    res.redirect('/rooms/add');
  }
};

// Render edit room form
exports.editForm = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).lean();
    const hostels = await Hostel.find().lean();
    if (!room) {
      req.flash('error', 'Room not found');
      return res.redirect('/rooms');
    }
    res.render('rooms/edit', { title: 'Edit Room', room, hostels });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load room');
    res.redirect('/rooms');
  }
};

// Update room
exports.update = async (req, res) => {
  try {
    const { hostelId, roomNumber, floor, capacity, roomType, monthlyFee, status } = req.body;
    await Room.findByIdAndUpdate(req.params.id, {
      hostelId,
      roomNumber: roomNumber.trim(),
      floor: parseInt(floor),
      capacity: parseInt(capacity),
      roomType,
      monthlyFee: parseFloat(monthlyFee),
      status
    });
    req.flash('success', 'Room updated successfully');
    res.redirect(`/rooms/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Failed to update room');
    res.redirect(`/rooms/${req.params.id}/edit`);
  }
};

// Delete room
exports.delete = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    req.flash('success', 'Room deleted successfully');
    res.redirect('/rooms');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete room');
    res.redirect('/rooms');
  }
};
