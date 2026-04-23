require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const app = express();

// --------------- Database Connection ---------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --------------- Middleware ---------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// Global template variables
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  next();
});

// --------------- View Engine ---------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// --------------- Routes ---------------
app.use('/', require('./routes/index'));
app.use('/hostels', require('./routes/hostels'));
app.use('/rooms', require('./routes/rooms'));
app.use('/students', require('./routes/students'));
app.use('/allocations', require('./routes/allocations'));
app.use('/complaints', require('./routes/complaints'));

// --------------- Error Handling ---------------
// 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Not Found',
    statusCode: 404,
    message: 'The page you are looking for does not exist.'
  });
});

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    statusCode: 500,
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// --------------- Start Server ---------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Hostel Management System running on http://localhost:${PORT}`);
});
