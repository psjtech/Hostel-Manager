# 🏠 Hostel Management System

A comprehensive full-stack Hostel Management System built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**. Manage hostels, rooms, students, room allocations, fee payments, and complaints — all from a clean, modern dashboard.

---

## ✨ Features

### 📊 Dashboard
- 6 key stat cards: Total Students, Rooms Available, Active Allocations, Fees Collected, Open Complaints, Resolved This Month
- Quick action buttons for common tasks
- Recent complaints overview

### 🏢 Hostel Management
- Add, edit, view, and delete hostels
- View rooms within each hostel
- Track warden details and hostel type (boys/girls/mixed)

### 🚪 Room Management
- CRUD operations for rooms
- Filter by hostel, status, and room type
- Auto-status update (available/full) based on occupancy
- Track monthly fees per room

### 🎓 Student Management
- Full student profiles with academic info
- Search by name, student ID, or email
- View allocation history and complaints per student
- Filter by course and year

### 🔑 Room Allocation
- Allocate rooms to students with availability checks
- Prevent double allocations (one active allocation per student)
- Dynamic room filtering by hostel
- Vacate rooms with automatic occupancy updates

### 💰 Fee Payment Tracking
- Record fee payments with auto-generated receipt numbers
- View payment history per allocation
- Fee summary dashboard showing all active allocations
- Overdue highlighting for current month
- Balance calculation (dues vs paid)

### 📋 Complaint Management
- Raise complaints with category and priority
- Status transitions: Open → In Progress → Resolved → Closed
- Admin remarks on each complaint
- Color-coded priority badges (green/amber/red)
- Filter by status, category, priority, and hostel
- Complaint statistics dashboard

---

## 📁 Folder Structure

```
Hostel Management System/
├── app.js                  # Express application entry point
├── seed.js                 # Database seed script
├── package.json
├── .env                    # Environment variables
├── .env.example
│
├── models/                 # Mongoose schemas
│   ├── Hostel.js
│   ├── Room.js
│   ├── Student.js
│   ├── HostelAllocation.js
│   └── Complaint.js
│
├── controllers/            # Route handlers
│   ├── dashboardController.js
│   ├── hostelController.js
│   ├── roomController.js
│   ├── studentController.js
│   ├── allocationController.js
│   └── complaintController.js
│
├── routes/                 # Express routes
│   ├── index.js
│   ├── hostels.js
│   ├── rooms.js
│   ├── students.js
│   ├── allocations.js
│   └── complaints.js
│
├── views/                  # EJS templates
│   ├── layout.ejs
│   ├── dashboard.ejs
│   ├── error.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── sidebar.ejs
│   │   └── flash.ejs
│   ├── hostels/
│   ├── rooms/
│   ├── students/
│   ├── allocations/
│   └── complaints/
│
└── public/                 # Static assets
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v16+
- **MongoDB** running locally or a MongoDB Atlas connection string

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd "Hostel Management System"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your MongoDB URI:
   ```
   MONGO_URI=mongodb://localhost:27017/hostel_management
   PORT=3000
   SESSION_SECRET=your_secret_key
   ```

4. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🛠️ Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Backend     | Node.js + Express   |
| Database    | MongoDB + Mongoose  |
| Templating  | EJS                 |
| Styling     | Vanilla CSS         |
| Session     | express-session     |
| Flash Msgs  | connect-flash       |

---

## 📝 API Routes

| Method | Route                          | Description               |
|--------|-------------------------------|---------------------------|
| GET    | `/`                           | Dashboard                 |
| GET    | `/hostels`                    | List hostels              |
| POST   | `/hostels`                    | Create hostel             |
| GET    | `/hostels/:id`                | View hostel               |
| POST   | `/hostels/:id`                | Update hostel             |
| POST   | `/hostels/:id/delete`         | Delete hostel             |
| GET    | `/rooms`                      | List rooms                |
| POST   | `/rooms`                      | Create room               |
| GET    | `/rooms/:id`                  | View room                 |
| POST   | `/rooms/:id`                  | Update room               |
| GET    | `/students`                   | List students             |
| POST   | `/students`                   | Create student            |
| GET    | `/students/:id`               | View student profile      |
| GET    | `/allocations`                | List allocations          |
| POST   | `/allocations`                | Create allocation         |
| GET    | `/allocations/:id`            | View allocation details   |
| POST   | `/allocations/:id/vacate`     | Vacate a room             |
| GET    | `/allocations/:id/payment`    | Payment form              |
| POST   | `/allocations/:id/payment`    | Record fee payment        |
| GET    | `/allocations/fee-summary`    | Fee summary dashboard     |
| GET    | `/complaints`                 | List complaints           |
| POST   | `/complaints`                 | Create complaint          |
| GET    | `/complaints/:id`             | View complaint            |
| POST   | `/complaints/:id/status`      | Update complaint status   |

---

## 📄 License

ISC
