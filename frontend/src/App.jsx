import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HostelList from './pages/HostelList';
import HostelDetail from './pages/HostelDetail';
import HostelForm from './pages/HostelForm';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import RoomForm from './pages/RoomForm';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import StudentForm from './pages/StudentForm';
import AllocationList from './pages/AllocationList';
import AllocationDetail from './pages/AllocationDetail';
import AllocationForm from './pages/AllocationForm';
import FeeSummary from './pages/FeeSummary';
import PaymentForm from './pages/PaymentForm';
import ComplaintList from './pages/ComplaintList';
import ComplaintDetail from './pages/ComplaintDetail';
import ComplaintForm from './pages/ComplaintForm';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hostels" element={<HostelList addToast={addToast} />} />
          <Route path="/hostels/add" element={<HostelForm addToast={addToast} />} />
          <Route path="/hostels/:id" element={<HostelDetail addToast={addToast} />} />
          <Route path="/hostels/:id/edit" element={<HostelForm addToast={addToast} />} />
          <Route path="/rooms" element={<RoomList addToast={addToast} />} />
          <Route path="/rooms/add" element={<RoomForm addToast={addToast} />} />
          <Route path="/rooms/:id" element={<RoomDetail addToast={addToast} />} />
          <Route path="/rooms/:id/edit" element={<RoomForm addToast={addToast} />} />
          <Route path="/students" element={<StudentList addToast={addToast} />} />
          <Route path="/students/add" element={<StudentForm addToast={addToast} />} />
          <Route path="/students/:id" element={<StudentDetail addToast={addToast} />} />
          <Route path="/students/:id/edit" element={<StudentForm addToast={addToast} />} />
          <Route path="/allocations" element={<AllocationList addToast={addToast} />} />
          <Route path="/allocations/add" element={<AllocationForm addToast={addToast} />} />
          <Route path="/allocations/fee-summary" element={<FeeSummary />} />
          <Route path="/allocations/:id" element={<AllocationDetail addToast={addToast} />} />
          <Route path="/allocations/:id/payment" element={<PaymentForm addToast={addToast} />} />
          <Route path="/complaints" element={<ComplaintList addToast={addToast} />} />
          <Route path="/complaints/add" element={<ComplaintForm addToast={addToast} />} />
          <Route path="/complaints/:id" element={<ComplaintDetail addToast={addToast} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
