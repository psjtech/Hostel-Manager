# 🚀 How to Run Hostel Manager Project

## ✅ Quick Start (One Command)

### Step 1: Open PowerShell/Terminal
Make sure you're in the **root directory** of the project:
```
C:\Git Learn\Hostel-Manager\
```

### Step 2: Run This Single Command
```powershell
npm run dev:all
```

That's it! Both servers will start automatically.

---

## 📍 Expected Output

You should see:
```
[0] 🚀 Hostel Management API running on http://localhost:3000
[0] ✅ MongoDB connected successfully

[1] ➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the App

Open your browser and go to:
```
http://localhost:5173/
```

---

## ⚠️ If It Doesn't Work

### Check 1: Are you in the right directory?
```powershell
# You MUST be here:
cd c:\Git Learn\Hostel-Manager
pwd  # This should show: C:\Git Learn\Hostel-Manager
```

### Check 2: Kill hanging processes
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Check 3: Try again
```powershell
npm run dev:all
```

---

## 🛑 To Stop the Servers

Press **Ctrl+C** once in the terminal.

---

## 📦 What This Command Does

```
npm run dev:all
```

This runs concurrently:
- **Backend**: `npm run dev:backend` → Port 3000 (Node.js + Express + MongoDB)
- **Frontend**: `npm run dev:frontend` → Port 5173 (React + Vite)

---

## 🔧 Individual Commands (If Needed)

### Run Only Backend
```powershell
cd backend
npm run dev
```

### Run Only Frontend
```powershell
cd frontend
npm run dev
```

---

## 📋 Directory Structure

```
Hostel-Manager/
├── backend/           ← API server
├── frontend/          ← React app
├── package.json       ← Root config
├── RUN_PROJECT.md     ← This file
└── ...
```

---

## ✨ Features Ready to Use

✅ Dashboard - Beautiful with gradient design  
✅ Hostels - Add, Edit, View  
✅ Rooms - Add, Edit, View with filters  
✅ Students - Add, Edit, View, Search  
✅ Allocations - Allocate rooms, Pay fees  
✅ Complaints - Raise, Track, Resolve  

---

## 💡 Tips

- Always run from **root directory**: `C:\Git Learn\Hostel-Manager\`
- MongoDB must be running (should be configured in `.env`)
- Close any existing node processes before starting
- Use `Ctrl+C` to stop (not `Ctrl+Z`)

---

**Questions? Always run:** `npm run dev:all` from the root directory! 🎉
