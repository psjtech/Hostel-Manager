require('dotenv').config();
const mongoose = require('mongoose');
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const Student = require('./models/Student');
const HostelAllocation = require('./models/HostelAllocation');
const Complaint = require('./models/Complaint');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Hostel.deleteMany({}),
      Room.deleteMany({}),
      Student.deleteMany({}),
      HostelAllocation.deleteMany({}),
      Complaint.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ---- Create Hostels ----
    const hostels = await Hostel.insertMany([
      {
        name: 'Sunrise Boys Hostel',
        address: '12, University Road, Near Main Gate, Campus Area',
        totalRooms: 6,
        type: 'boys',
        warden: { name: 'Mr. Rajesh Kumar', contact: '9876543210' }
      },
      {
        name: 'Lakshmi Girls Hostel',
        address: '5, Knowledge Park, South Campus',
        totalRooms: 4,
        type: 'girls',
        warden: { name: 'Mrs. Sunita Patel', contact: '9876543211' }
      }
    ]);
    console.log(`🏢 Created ${hostels.length} hostels`);

    // ---- Create Rooms ----
    const rooms = await Room.insertMany([
      // Sunrise Boys Hostel
      { hostelId: hostels[0]._id, roomNumber: 'SB-101', floor: 1, capacity: 1, occupiedCount: 1, roomType: 'single', monthlyFee: 8000, status: 'full' },
      { hostelId: hostels[0]._id, roomNumber: 'SB-102', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 6000, status: 'available' },
      { hostelId: hostels[0]._id, roomNumber: 'SB-103', floor: 1, capacity: 2, occupiedCount: 2, roomType: 'double', monthlyFee: 6000, status: 'full' },
      { hostelId: hostels[0]._id, roomNumber: 'SB-201', floor: 2, capacity: 3, occupiedCount: 0, roomType: 'triple', monthlyFee: 4500, status: 'available' },
      { hostelId: hostels[0]._id, roomNumber: 'SB-202', floor: 2, capacity: 1, occupiedCount: 0, roomType: 'single', monthlyFee: 8000, status: 'maintenance' },
      { hostelId: hostels[0]._id, roomNumber: 'SB-203', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 6000, status: 'available' },
      // Lakshmi Girls Hostel
      { hostelId: hostels[1]._id, roomNumber: 'LG-101', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 6500, status: 'available' },
      { hostelId: hostels[1]._id, roomNumber: 'LG-102', floor: 1, capacity: 1, occupiedCount: 1, roomType: 'single', monthlyFee: 8500, status: 'full' },
      { hostelId: hostels[1]._id, roomNumber: 'LG-201', floor: 2, capacity: 3, occupiedCount: 0, roomType: 'triple', monthlyFee: 5000, status: 'available' },
      { hostelId: hostels[1]._id, roomNumber: 'LG-202', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 6500, status: 'available' }
    ]);
    console.log(`🚪 Created ${rooms.length} rooms`);

    // ---- Create Students ----
    const students = await Student.insertMany([
      { name: 'Rahul Sharma', email: 'rahul.sharma@university.edu', phone: '9001234567', studentId: 'STU001', course: 'B.Tech CSE', year: 2, parentContact: '9801234567', address: '45, MG Road, Jaipur, Rajasthan' },
      { name: 'Priya Singh', email: 'priya.singh@university.edu', phone: '9001234568', studentId: 'STU002', course: 'B.Tech ECE', year: 3, parentContact: '9801234568', address: '12, Nehru Nagar, Delhi' },
      { name: 'Amit Patel', email: 'amit.patel@university.edu', phone: '9001234569', studentId: 'STU003', course: 'B.Sc Physics', year: 1, parentContact: '9801234569', address: '78, Sardar Patel Road, Ahmedabad' },
      { name: 'Neha Gupta', email: 'neha.gupta@university.edu', phone: '9001234570', studentId: 'STU004', course: 'B.Tech IT', year: 2, parentContact: '9801234570', address: '33, Civil Lines, Lucknow' },
      { name: 'Vikram Joshi', email: 'vikram.joshi@university.edu', phone: '9001234571', studentId: 'STU005', course: 'B.Tech ME', year: 4, parentContact: '9801234571', address: '56, Brigade Road, Bangalore' },
      { name: 'Sneha Reddy', email: 'sneha.reddy@university.edu', phone: '9001234572', studentId: 'STU006', course: 'B.Com', year: 1, parentContact: '9801234572', address: '90, Banjara Hills, Hyderabad' },
      { name: 'Arjun Nair', email: 'arjun.nair@university.edu', phone: '9001234573', studentId: 'STU007', course: 'B.Tech CSE', year: 3, parentContact: '9801234573', address: '24, Marine Drive, Kochi' },
      { name: 'Kavya Menon', email: 'kavya.menon@university.edu', phone: '9001234574', studentId: 'STU008', course: 'B.Sc Chemistry', year: 2, parentContact: '9801234574', address: '67, Anna Salai, Chennai' }
    ]);
    console.log(`🎓 Created ${students.length} students`);

    // ---- Create Allocations ----
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const lastMonthName = lastMonth.toLocaleString('default', { month: 'long' });

    const allocations = await HostelAllocation.insertMany([
      {
        studentId: students[0]._id, roomId: rooms[0]._id, hostelId: hostels[0]._id,
        allocationDate: new Date(currentYear, 0, 15),
        status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 8000, paidOn: new Date(currentYear, 0, 20), receiptNo: 'RCP-JAN001' },
          { month: 'February', year: currentYear, amount: 8000, paidOn: new Date(currentYear, 1, 18), receiptNo: 'RCP-FEB001' },
          { month: 'March', year: currentYear, amount: 8000, paidOn: new Date(currentYear, 2, 15), receiptNo: 'RCP-MAR001' }
        ],
        totalFeesDue: 8000 * 4,
        totalFeesPaid: 24000
      },
      {
        studentId: students[1]._id, roomId: rooms[6]._id, hostelId: hostels[1]._id,
        allocationDate: new Date(currentYear, 1, 1),
        status: 'active',
        feesPaid: [
          { month: 'February', year: currentYear, amount: 6500, paidOn: new Date(currentYear, 1, 10), receiptNo: 'RCP-FEB002' },
          { month: 'March', year: currentYear, amount: 6500, paidOn: new Date(currentYear, 2, 12), receiptNo: 'RCP-MAR002' },
          { month: currentMonth, year: currentYear, amount: 6500, paidOn: new Date(), receiptNo: 'RCP-CUR002' }
        ],
        totalFeesDue: 6500 * 3,
        totalFeesPaid: 19500
      },
      {
        studentId: students[2]._id, roomId: rooms[1]._id, hostelId: hostels[0]._id,
        allocationDate: new Date(currentYear, 2, 1),
        status: 'active',
        feesPaid: [
          { month: 'March', year: currentYear, amount: 6000, paidOn: new Date(currentYear, 2, 20), receiptNo: 'RCP-MAR003' }
        ],
        totalFeesDue: 6000 * 2,
        totalFeesPaid: 6000
      },
      {
        studentId: students[3]._id, roomId: rooms[2]._id, hostelId: hostels[0]._id,
        allocationDate: new Date(currentYear, 0, 10),
        status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 6000, paidOn: new Date(currentYear, 0, 15), receiptNo: 'RCP-JAN004' },
          { month: 'February', year: currentYear, amount: 6000, paidOn: new Date(currentYear, 1, 14), receiptNo: 'RCP-FEB004' }
        ],
        totalFeesDue: 6000 * 4,
        totalFeesPaid: 12000
      },
      {
        studentId: students[5]._id, roomId: rooms[7]._id, hostelId: hostels[1]._id,
        allocationDate: new Date(currentYear, 2, 15),
        status: 'active',
        feesPaid: [
          { month: 'March', year: currentYear, amount: 8500, paidOn: new Date(currentYear, 2, 20), receiptNo: 'RCP-MAR006' },
          { month: currentMonth, year: currentYear, amount: 8500, paidOn: new Date(), receiptNo: 'RCP-CUR006' }
        ],
        totalFeesDue: 8500 * 2,
        totalFeesPaid: 17000
      }
    ]);
    console.log(`🔑 Created ${allocations.length} allocations`);

    // ---- Create Complaints ----
    const complaints = await Complaint.insertMany([
      {
        studentId: students[0]._id, hostelId: hostels[0]._id, roomId: rooms[0]._id,
        title: 'Water leakage in bathroom',
        description: 'There is a constant water leakage from the bathroom tap. It has been going on for 3 days and the floor remains wet all the time, making it slippery.',
        category: 'maintenance', priority: 'high', status: 'open',
        raisedOn: new Date(currentYear, now.getMonth(), 10)
      },
      {
        studentId: students[1]._id, hostelId: hostels[1]._id, roomId: rooms[6]._id,
        title: 'Mess food quality decline',
        description: 'The quality of food served in the mess has significantly declined over the past two weeks. The dal is often undercooked and vegetables taste stale.',
        category: 'food', priority: 'medium', status: 'in-progress',
        raisedOn: new Date(currentYear, now.getMonth(), 5),
        adminRemarks: 'Spoken with the mess contractor. Will monitor for the next week.'
      },
      {
        studentId: students[2]._id, hostelId: hostels[0]._id, roomId: rooms[1]._id,
        title: 'Broken window latch',
        description: 'The window latch in our room is broken and the window cannot be closed properly. This is a security concern especially at night.',
        category: 'security', priority: 'high', status: 'resolved',
        raisedOn: new Date(currentYear, now.getMonth() - 1, 25),
        resolvedOn: new Date(currentYear, now.getMonth(), 2),
        adminRemarks: 'Maintenance team has fixed the window latch.'
      }
    ]);
    console.log(`📋 Created ${complaints.length} complaints`);

    console.log('\n🎉 Seed data inserted successfully!');
    console.log('   Run "npm start" to launch the application.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedData();
