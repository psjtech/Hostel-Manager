const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'Hostel is required']
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room is required']
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['maintenance', 'hygiene', 'security', 'food', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority'
    }
  },
  status: {
    type: String,
    default: 'open',
    enum: {
      values: ['open', 'in-progress', 'resolved', 'closed'],
      message: '{VALUE} is not a valid status'
    }
  },
  raisedOn: {
    type: Date,
    default: Date.now
  },
  resolvedOn: {
    type: Date,
    default: null
  },
  adminRemarks: {
    type: String,
    default: '',
    trim: true
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
