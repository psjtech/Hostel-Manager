const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hostel name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms is required'],
    min: [1, 'Must have at least 1 room']
  },
  type: {
    type: String,
    required: [true, 'Hostel type is required'],
    enum: {
      values: ['boys', 'girls', 'mixed'],
      message: '{VALUE} is not a valid hostel type'
    }
  },
  warden: {
    name: {
      type: String,
      required: [true, 'Warden name is required'],
      trim: true
    },
    contact: {
      type: String,
      required: [true, 'Warden contact is required'],
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hostel', hostelSchema);
