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

    res.json({ success: true, data: hostels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load hostels' });
  }
};

// Show single hostel
exports.show = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).lean();
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    const rooms = await Room.find({ hostelId: hostel._id }).sort({ floor: 1, roomNumber: 1 }).lean();
    res.json({ success: true, data: { hostel, rooms } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load hostel' });
  }
};

// Create hostel
exports.create = async (req, res) => {
  try {
    const { name, address, totalRooms, type, wardenName, wardenContact } = req.body;
    const hostel = await Hostel.create({
      name,
      address,
      totalRooms: parseInt(totalRooms),
      type,
      warden: { name: wardenName, contact: wardenContact }
    });
    res.status(201).json({ success: true, data: hostel, message: 'Hostel added successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to add hostel' });
  }
};

// Update hostel
exports.update = async (req, res) => {
  try {
    const { name, address, totalRooms, type, wardenName, wardenContact } = req.body;
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, {
      name,
      address,
      totalRooms: parseInt(totalRooms),
      type,
      warden: { name: wardenName, contact: wardenContact }
    }, { new: true });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    res.json({ success: true, data: hostel, message: 'Hostel updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Failed to update hostel' });
  }
};

// Delete hostel
exports.delete = async (req, res) => {
  try {
    await Room.deleteMany({ hostelId: req.params.id });
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hostel deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete hostel' });
  }
};
