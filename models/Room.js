const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'Hostel reference is required']
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  floor: {
    type: Number,
    required: [true, 'Floor is required'],
    min: [0, 'Floor cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [4, 'Capacity cannot exceed 4']
  },
  occupiedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: {
      values: ['single', 'double', 'triple'],
      message: '{VALUE} is not a valid room type'
    }
  },
  monthlyFee: {
    type: Number,
    required: [true, 'Monthly fee is required'],
    min: [0, 'Fee cannot be negative']
  },
  status: {
    type: String,
    default: 'available',
    enum: {
      values: ['available', 'full', 'maintenance'],
      message: '{VALUE} is not a valid status'
    }
  }
});

// Auto-update status when occupiedCount changes
roomSchema.pre('save', function (next) {
  if (this.occupiedCount >= this.capacity) {
    this.status = 'full';
  } else if (this.status === 'full' && this.occupiedCount < this.capacity) {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
