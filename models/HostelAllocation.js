const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidOn: {
    type: Date,
    default: Date.now
  },
  receiptNo: {
    type: String,
    required: true
  }
});

const hostelAllocationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room is required']
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'Hostel is required']
  },
  allocationDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  vacatingDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    default: 'active',
    enum: {
      values: ['active', 'vacated'],
      message: '{VALUE} is not a valid allocation status'
    }
  },
  feesPaid: [feePaymentSchema],
  totalFeesDue: {
    type: Number,
    default: 0,
    min: 0
  },
  totalFeesPaid: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('HostelAllocation', hostelAllocationSchema);
