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

    // ---- Create Hostels (Shoolini University GHS) ----
    const hostels = await Hostel.insertMany([
      {
        name: 'Shoolini Residences (Girls Block)',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 8,
        type: 'girls',
        warden: { name: 'Mrs. Anita Sharma', contact: '9816001001' }
      },
      {
        name: 'Shoolini Residences (Boys Block)',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 8,
        type: 'boys',
        warden: { name: 'Mr. Vikram Thakur', contact: '9816001002' }
      },
      {
        name: 'Shoolini Village (Girls Block)',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 10,
        type: 'girls',
        warden: { name: 'Mrs. Kavita Devi', contact: '9816001003' }
      },
      {
        name: 'Shoolini Village (Boys Block A)',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 10,
        type: 'boys',
        warden: { name: 'Mr. Rajesh Verma', contact: '9816001004' }
      },
      {
        name: 'Shoolini Village (Boys Block B)',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 8,
        type: 'boys',
        warden: { name: 'Mr. Sunil Kumar', contact: '9816001005' }
      },
      {
        name: 'International Hostel',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 6,
        type: 'boys',
        warden: { name: 'Mr. David Fernandes', contact: '9816001006' }
      },
      {
        name: 'Aryabhata Hostel',
        address: 'Solan-Oachghat-Kumarhatti Hwy, Bajhol, Himachal Pradesh 173229',
        totalRooms: 8,
        type: 'boys',
        warden: { name: 'Mr. Manoj Chauhan', contact: '9816001007' }
      }
    ]);
    console.log(`🏢 Created ${hostels.length} hostels`);

    // ---- Create Rooms ----
    const rooms = await Room.insertMany([
      // Shoolini Residences Girls (Heated + Attached WR) — ₹1,02,000/semester → ₹17,000/month
      { hostelId: hostels[0]._id, roomNumber: 'SRG-101', floor: 1, capacity: 2, occupiedCount: 2, roomType: 'double', monthlyFee: 17000, status: 'full' },
      { hostelId: hostels[0]._id, roomNumber: 'SRG-102', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 17000, status: 'available' },
      { hostelId: hostels[0]._id, roomNumber: 'SRG-201', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 17000, status: 'available' },
      { hostelId: hostels[0]._id, roomNumber: 'SRG-202', floor: 2, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 17000, status: 'available' },

      // Shoolini Residences Boys (Heated + Attached) — ₹1,02,000/semester → ₹17,000/month
      { hostelId: hostels[1]._id, roomNumber: 'SRB-101', floor: 1, capacity: 2, occupiedCount: 2, roomType: 'double', monthlyFee: 17000, status: 'full' },
      { hostelId: hostels[1]._id, roomNumber: 'SRB-102', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 17000, status: 'available' },
      { hostelId: hostels[1]._id, roomNumber: 'SRB-201', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 17000, status: 'available' },
      { hostelId: hostels[1]._id, roomNumber: 'SRB-202', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 17000, status: 'maintenance' },

      // Shoolini Village Girls — mix of double (₹98,500→₹16,417) and triple (₹88,500→₹14,750 & ₹68,000→₹11,333)
      { hostelId: hostels[2]._id, roomNumber: 'SVG-101', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 16417, status: 'available' },
      { hostelId: hostels[2]._id, roomNumber: 'SVG-102', floor: 1, capacity: 3, occupiedCount: 2, roomType: 'triple', monthlyFee: 14750, status: 'available' },
      { hostelId: hostels[2]._id, roomNumber: 'SVG-201', floor: 2, capacity: 3, occupiedCount: 0, roomType: 'triple', monthlyFee: 11333, status: 'available' },
      { hostelId: hostels[2]._id, roomNumber: 'SVG-202', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 16417, status: 'available' },

      // Shoolini Village Boys Block A — double (₹98,500→₹16,417) and triple (₹88,500→₹14,750)
      { hostelId: hostels[3]._id, roomNumber: 'SVA-101', floor: 1, capacity: 2, occupiedCount: 2, roomType: 'double', monthlyFee: 16417, status: 'full' },
      { hostelId: hostels[3]._id, roomNumber: 'SVA-102', floor: 1, capacity: 3, occupiedCount: 1, roomType: 'triple', monthlyFee: 14750, status: 'available' },
      { hostelId: hostels[3]._id, roomNumber: 'SVA-201', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 16417, status: 'available' },
      { hostelId: hostels[3]._id, roomNumber: 'SVA-202', floor: 2, capacity: 3, occupiedCount: 0, roomType: 'triple', monthlyFee: 14750, status: 'available' },

      // Shoolini Village Boys Block B — double-small (₹91,000→₹15,167) and double-common (₹78,500→₹13,083)
      { hostelId: hostels[4]._id, roomNumber: 'SVB-101', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 15167, status: 'available' },
      { hostelId: hostels[4]._id, roomNumber: 'SVB-102', floor: 1, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 13083, status: 'available' },
      { hostelId: hostels[4]._id, roomNumber: 'SVB-201', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 15167, status: 'available' },
      { hostelId: hostels[4]._id, roomNumber: 'SVB-202', floor: 2, capacity: 2, occupiedCount: 2, roomType: 'double', monthlyFee: 13083, status: 'full' },

      // International Hostel — double (₹91,500→₹15,250)
      { hostelId: hostels[5]._id, roomNumber: 'INT-101', floor: 1, capacity: 2, occupiedCount: 1, roomType: 'double', monthlyFee: 15250, status: 'available' },
      { hostelId: hostels[5]._id, roomNumber: 'INT-102', floor: 1, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 15250, status: 'available' },
      { hostelId: hostels[5]._id, roomNumber: 'INT-201', floor: 2, capacity: 2, occupiedCount: 0, roomType: 'double', monthlyFee: 15250, status: 'available' },

      // Aryabhata Hostel — triple (₹84,500→₹14,083)
      { hostelId: hostels[6]._id, roomNumber: 'ARY-101', floor: 1, capacity: 3, occupiedCount: 2, roomType: 'triple', monthlyFee: 14083, status: 'available' },
      { hostelId: hostels[6]._id, roomNumber: 'ARY-102', floor: 1, capacity: 3, occupiedCount: 0, roomType: 'triple', monthlyFee: 14083, status: 'available' },
      { hostelId: hostels[6]._id, roomNumber: 'ARY-201', floor: 2, capacity: 3, occupiedCount: 0, roomType: 'triple', monthlyFee: 14083, status: 'maintenance' },
      { hostelId: hostels[6]._id, roomNumber: 'ARY-202', floor: 2, capacity: 3, occupiedCount: 1, roomType: 'triple', monthlyFee: 14083, status: 'available' }
    ]);
    console.log(`🚪 Created ${rooms.length} rooms`);

    // ---- Create Students (Shoolini University) ----
    const students = await Student.insertMany([
      { name: 'Pratham Jamwal', email: 'pratham.jamwal@shooliniuniversity.com', phone: '9816100001', studentId: 'SU2026001', course: 'B.Tech CSE', year: 2, parentContact: '9816200001', address: '45, Sector 5, Panchkula, Haryana' },
      { name: 'Ananya Sharma', email: 'ananya.sharma@shooliniuniversity.com', phone: '9816100002', studentId: 'SU2026002', course: 'B.Pharm', year: 3, parentContact: '9816200002', address: '12, Mall Road, Shimla, HP' },
      { name: 'Rohan Kapoor', email: 'rohan.kapoor@shooliniuniversity.com', phone: '9816100003', studentId: 'SU2026003', course: 'MBA', year: 1, parentContact: '9816200003', address: '78, Model Town, Jalandhar, Punjab' },
      { name: 'Megha Thakur', email: 'megha.thakur@shooliniuniversity.com', phone: '9816100004', studentId: 'SU2026004', course: 'B.Sc Biotechnology', year: 2, parentContact: '9816200004', address: '33, Rajpur Road, Dehradun, Uttarakhand' },
      { name: 'Arjun Singh Rathore', email: 'arjun.rathore@shooliniuniversity.com', phone: '9816100005', studentId: 'SU2026005', course: 'B.Tech CSE', year: 4, parentContact: '9816200005', address: '56, Sector 15, Chandigarh' },
      { name: 'Priya Negi', email: 'priya.negi@shooliniuniversity.com', phone: '9816100006', studentId: 'SU2026006', course: 'B.Sc Microbiology', year: 1, parentContact: '9816200006', address: '90, Lakkar Bazaar, Shimla, HP' },
      { name: 'Karan Mehta', email: 'karan.mehta@shooliniuniversity.com', phone: '9816100007', studentId: 'SU2026007', course: 'B.Tech ECE', year: 3, parentContact: '9816200007', address: '24, Civil Lines, Ludhiana, Punjab' },
      { name: 'Sneha Chauhan', email: 'sneha.chauhan@shooliniuniversity.com', phone: '9816100008', studentId: 'SU2026008', course: 'B.Com', year: 2, parentContact: '9816200008', address: '67, Subhash Nagar, Solan, HP' },
      { name: 'Vikram Thakur', email: 'vikram.thakur@shooliniuniversity.com', phone: '9816100009', studentId: 'SU2026009', course: 'B.Tech ME', year: 2, parentContact: '9816200009', address: '15, Sanjauli, Shimla, HP' },
      { name: 'Ishita Verma', email: 'ishita.verma@shooliniuniversity.com', phone: '9816100010', studentId: 'SU2026010', course: 'B.Pharm', year: 1, parentContact: '9816200010', address: '42, Sector 22, Chandigarh' },
      { name: 'Dev Sharma', email: 'dev.sharma@shooliniuniversity.com', phone: '9816100011', studentId: 'SU2026011', course: 'B.Tech CSE (AI)', year: 1, parentContact: '9816200011', address: '88, Green Park, New Delhi' },
      { name: 'Riya Gupta', email: 'riya.gupta@shooliniuniversity.com', phone: '9816100012', studentId: 'SU2026012', course: 'MBA', year: 2, parentContact: '9816200012', address: '11, Aashiana Colony, Lucknow, UP' }
    ]);
    console.log(`🎓 Created ${students.length} students`);

    // ---- Create Allocations ----
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    const allocations = await HostelAllocation.insertMany([
      // Pratham → SRB-101 (Boys Residences)
      {
        studentId: students[0]._id, roomId: rooms[4]._id, hostelId: hostels[1]._id,
        allocationDate: new Date(currentYear, 0, 10), status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 0, 15), receiptNo: 'GHS-JAN001' },
          { month: 'February', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 1, 12), receiptNo: 'GHS-FEB001' },
          { month: 'March', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 2, 14), receiptNo: 'GHS-MAR001' }
        ],
        totalFeesDue: 17000 * 4, totalFeesPaid: 51000
      },
      // Ananya → SRG-101 (Girls Residences)
      {
        studentId: students[1]._id, roomId: rooms[0]._id, hostelId: hostels[0]._id,
        allocationDate: new Date(currentYear, 1, 1), status: 'active',
        feesPaid: [
          { month: 'February', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 1, 10), receiptNo: 'GHS-FEB002' },
          { month: 'March', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 2, 8), receiptNo: 'GHS-MAR002' },
          { month: currentMonth, year: currentYear, amount: 17000, paidOn: new Date(), receiptNo: 'GHS-CUR002' }
        ],
        totalFeesDue: 17000 * 3, totalFeesPaid: 51000
      },
      // Rohan → SVA-101 (Village Boys A)
      {
        studentId: students[2]._id, roomId: rooms[12]._id, hostelId: hostels[3]._id,
        allocationDate: new Date(currentYear, 0, 15), status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 16417, paidOn: new Date(currentYear, 0, 20), receiptNo: 'GHS-JAN003' },
          { month: 'February', year: currentYear, amount: 16417, paidOn: new Date(currentYear, 1, 18), receiptNo: 'GHS-FEB003' }
        ],
        totalFeesDue: 16417 * 4, totalFeesPaid: 32834
      },
      // Megha → SVG-101 (Village Girls)
      {
        studentId: students[3]._id, roomId: rooms[8]._id, hostelId: hostels[2]._id,
        allocationDate: new Date(currentYear, 2, 1), status: 'active',
        feesPaid: [
          { month: 'March', year: currentYear, amount: 16417, paidOn: new Date(currentYear, 2, 10), receiptNo: 'GHS-MAR004' },
          { month: currentMonth, year: currentYear, amount: 16417, paidOn: new Date(), receiptNo: 'GHS-CUR004' }
        ],
        totalFeesDue: 16417 * 2, totalFeesPaid: 32834
      },
      // Arjun → SRB-101 (Boys Residences, same room as Pratham)
      {
        studentId: students[4]._id, roomId: rooms[4]._id, hostelId: hostels[1]._id,
        allocationDate: new Date(currentYear, 0, 10), status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 0, 16), receiptNo: 'GHS-JAN005' },
          { month: 'February', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 1, 15), receiptNo: 'GHS-FEB005' },
          { month: 'March', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 2, 12), receiptNo: 'GHS-MAR005' },
          { month: currentMonth, year: currentYear, amount: 17000, paidOn: new Date(), receiptNo: 'GHS-CUR005' }
        ],
        totalFeesDue: 17000 * 4, totalFeesPaid: 68000
      },
      // Priya → SRG-101 (Girls Residences, same room as Ananya)
      {
        studentId: students[5]._id, roomId: rooms[0]._id, hostelId: hostels[0]._id,
        allocationDate: new Date(currentYear, 2, 15), status: 'active',
        feesPaid: [
          { month: 'March', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 2, 20), receiptNo: 'GHS-MAR006' }
        ],
        totalFeesDue: 17000 * 2, totalFeesPaid: 17000
      },
      // Karan → INT-101 (International Hostel)
      {
        studentId: students[6]._id, roomId: rooms[20]._id, hostelId: hostels[5]._id,
        allocationDate: new Date(currentYear, 0, 5), status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 15250, paidOn: new Date(currentYear, 0, 10), receiptNo: 'GHS-JAN007' },
          { month: 'February', year: currentYear, amount: 15250, paidOn: new Date(currentYear, 1, 12), receiptNo: 'GHS-FEB007' },
          { month: 'March', year: currentYear, amount: 15250, paidOn: new Date(currentYear, 2, 10), receiptNo: 'GHS-MAR007' },
          { month: currentMonth, year: currentYear, amount: 15250, paidOn: new Date(), receiptNo: 'GHS-CUR007' }
        ],
        totalFeesDue: 15250 * 4, totalFeesPaid: 61000
      },
      // Sneha → SVG-102 (Village Girls triple)
      {
        studentId: students[7]._id, roomId: rooms[9]._id, hostelId: hostels[2]._id,
        allocationDate: new Date(currentYear, 1, 1), status: 'active',
        feesPaid: [
          { month: 'February', year: currentYear, amount: 14750, paidOn: new Date(currentYear, 1, 8), receiptNo: 'GHS-FEB008' }
        ],
        totalFeesDue: 14750 * 3, totalFeesPaid: 14750
      },
      // Vikram → SVB-101 (Village Boys B)
      {
        studentId: students[8]._id, roomId: rooms[16]._id, hostelId: hostels[4]._id,
        allocationDate: new Date(currentYear, 2, 1), status: 'active',
        feesPaid: [
          { month: 'March', year: currentYear, amount: 15167, paidOn: new Date(currentYear, 2, 5), receiptNo: 'GHS-MAR009' },
          { month: currentMonth, year: currentYear, amount: 15167, paidOn: new Date(), receiptNo: 'GHS-CUR009' }
        ],
        totalFeesDue: 15167 * 2, totalFeesPaid: 30334
      },
      // Ishita → SVG-102 (Village Girls triple, with Sneha)
      {
        studentId: students[9]._id, roomId: rooms[9]._id, hostelId: hostels[2]._id,
        allocationDate: new Date(currentYear, 2, 10), status: 'active',
        feesPaid: [
          { month: 'March', year: currentYear, amount: 14750, paidOn: new Date(currentYear, 2, 15), receiptNo: 'GHS-MAR010' }
        ],
        totalFeesDue: 14750 * 2, totalFeesPaid: 14750
      },
      // Dev → ARY-101 (Aryabhata)
      {
        studentId: students[10]._id, roomId: rooms[24]._id, hostelId: hostels[6]._id,
        allocationDate: new Date(currentYear, 0, 20), status: 'active',
        feesPaid: [
          { month: 'January', year: currentYear, amount: 14083, paidOn: new Date(currentYear, 0, 25), receiptNo: 'GHS-JAN011' },
          { month: 'February', year: currentYear, amount: 14083, paidOn: new Date(currentYear, 1, 20), receiptNo: 'GHS-FEB011' },
          { month: 'March', year: currentYear, amount: 14083, paidOn: new Date(currentYear, 2, 18), receiptNo: 'GHS-MAR011' }
        ],
        totalFeesDue: 14083 * 4, totalFeesPaid: 42249
      },
      // Riya → SRG-202 (Girls Residences)
      {
        studentId: students[11]._id, roomId: rooms[3]._id, hostelId: hostels[0]._id,
        allocationDate: new Date(currentYear, 1, 15), status: 'active',
        feesPaid: [
          { month: 'February', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 1, 20), receiptNo: 'GHS-FEB012' },
          { month: 'March', year: currentYear, amount: 17000, paidOn: new Date(currentYear, 2, 16), receiptNo: 'GHS-MAR012' }
        ],
        totalFeesDue: 17000 * 3, totalFeesPaid: 34000
      }
    ]);
    console.log(`🔑 Created ${allocations.length} allocations`);

    // ---- Create Complaints ----
    const complaints = await Complaint.insertMany([
      {
        studentId: students[0]._id, hostelId: hostels[1]._id, roomId: rooms[4]._id,
        title: 'Water heater not working in washroom',
        description: 'The geyser in our attached washroom has stopped working since last week. With the cold weather in Kasauli, this is causing severe inconvenience. Urgent repair needed.',
        category: 'maintenance', priority: 'high', status: 'open',
        raisedOn: new Date(currentYear, now.getMonth(), 8)
      },
      {
        studentId: students[1]._id, hostelId: hostels[0]._id, roomId: rooms[0]._id,
        title: 'Mess food quality has declined',
        description: 'The quality of food served by GHS mess has significantly declined over the past two weeks. The chapatis are often undercooked and dal tastes stale. Multiple students have complained about this.',
        category: 'food', priority: 'medium', status: 'in-progress',
        raisedOn: new Date(currentYear, now.getMonth(), 5),
        adminRemarks: 'GHS catering team has been notified. Inspection scheduled for this weekend.'
      },
      {
        studentId: students[6]._id, hostelId: hostels[5]._id, roomId: rooms[20]._id,
        title: 'CCTV camera not functioning at Block B entrance',
        description: 'The CCTV camera at the main entrance of International Hostel Block B has been offline for 3 days. This is a security concern especially during late hours.',
        category: 'security', priority: 'high', status: 'resolved',
        raisedOn: new Date(currentYear, now.getMonth() - 1, 22),
        resolvedOn: new Date(currentYear, now.getMonth(), 1),
        adminRemarks: 'CCTV has been repaired and tested. All cameras are now online 24x7.'
      },
      {
        studentId: students[7]._id, hostelId: hostels[2]._id, roomId: rooms[9]._id,
        title: 'Washroom cleaning schedule not followed',
        description: 'The common washroom on the first floor is not being cleaned as per the scheduled timings. The housekeeping staff often skips the evening cleaning session.',
        category: 'hygiene', priority: 'medium', status: 'open',
        raisedOn: new Date(currentYear, now.getMonth(), 12)
      },
      {
        studentId: students[10]._id, hostelId: hostels[6]._id, roomId: rooms[24]._id,
        title: 'Wi-Fi connectivity issues on 2nd floor',
        description: 'The Wi-Fi signal on the 2nd floor of Aryabhata Hostel is extremely weak. We are unable to attend online lectures or submit assignments. The router seems to need replacement.',
        category: 'other', priority: 'low', status: 'closed',
        raisedOn: new Date(currentYear, now.getMonth() - 1, 15),
        resolvedOn: new Date(currentYear, now.getMonth() - 1, 20),
        adminRemarks: 'New Wi-Fi access point has been installed on the 2nd floor. Signal strength is now optimal.'
      },
      {
        studentId: students[4]._id, hostelId: hostels[1]._id, roomId: rooms[4]._id,
        title: 'Window latch broken — security concern',
        description: 'The window latch in Room SRB-101 is broken and the window cannot be closed properly during strong winds. This is dangerous given the hilly terrain.',
        category: 'maintenance', priority: 'high', status: 'in-progress',
        raisedOn: new Date(currentYear, now.getMonth(), 3),
        adminRemarks: 'Maintenance team has ordered replacement parts. Expected fix within 2 days.'
      }
    ]);
    console.log(`📋 Created ${complaints.length} complaints`);

    console.log('\n🎉 Shoolini University GHS Hostel data seeded successfully!');
    console.log('   Run "npm run dev" to launch the API.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedData();
