require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --------------- Database Connection ---------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --------------- Middleware ---------------
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --------------- API Routes ---------------
app.use('/api', require('./routes/index'));
app.use('/api/hostels', require('./routes/hostels'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/students', require('./routes/students'));
app.use('/api/allocations', require('./routes/allocations'));
app.use('/api/complaints', require('./routes/complaints'));

// --------------- Error Handling ---------------
// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// --------------- Start Server ---------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Hostel Management API running on http://localhost:${PORT}`);
});
