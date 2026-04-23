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

    res.json({ success: true, data: { rooms, hostels } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load rooms' });
  }
};

// Show single room
exports.show = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostelId').lean();
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load room' });
  }
};

// Create room
exports.create = async (req, res) => {
  try {
    const { hostelId, roomNumber, floor, capacity, roomType, monthlyFee, status } = req.body;
    const room = await Room.create({
      hostelId,
      roomNumber: roomNumber.trim(),
      floor: parseInt(floor),
      capacity: parseInt(capacity),
      roomType,
      monthlyFee: parseFloat(monthlyFee),
      status: status || 'available'
    });
    res.status(201).json({ success: true, data: room, message: 'Room added successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to add room' });
  }
};

// Update room
exports.update = async (req, res) => {
  try {
    const { hostelId, roomNumber, floor, capacity, roomType, monthlyFee, status } = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, {
      hostelId,
      roomNumber: roomNumber.trim(),
      floor: parseInt(floor),
      capacity: parseInt(capacity),
      roomType,
      monthlyFee: parseFloat(monthlyFee),
      status
    }, { new: true });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room, message: 'Room updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to update room' });
  }
};

// Delete room
exports.delete = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete room' });
  }
};
