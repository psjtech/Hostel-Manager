import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function AllocationForm({ addToast }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ students: [], hostels: [], rooms: [] });
  const [form, setForm] = useState({ studentId: '', roomId: '', hostelId: '', allocationDate: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/allocations/form-data').then(r => { setFormData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filteredRooms = form.hostelId
    ? formData.rooms.filter(r => (r.hostelId?._id || r.hostelId) === form.hostelId)
    : formData.rooms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/allocations', form);
      addToast('Room allocated successfully');
      navigate('/allocations');
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/allocations">Allocations</Link><span className="separator">/</span><span>Allocate Room</span></div>
      <div className="card" style={{maxWidth:700}}>
        <div className="card-header"><h2>🔑 Allocate Room</h2></div>
        <div className="card-body">
          {!formData.students.length && <div className="info-box info-amber">⚠️ All students already have active allocations. No students available.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student *</label>
              <select className="form-control" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required>
                <option value="">-- Select Student --</option>
                {formData.students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
              </select>
              <span className="form-hint">Only students without active allocations are shown</span>
            </div>
            <div className="form-group">
              <label className="form-label">Hostel *</label>
              <select className="form-control" value={form.hostelId} onChange={e => setForm({...form, hostelId: e.target.value, roomId: ''})} required>
                <option value="">-- Select Hostel --</option>
                {formData.hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room *</label>
              <select className="form-control" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} required>
                <option value="">-- Select Room --</option>
                {filteredRooms.map(r => <option key={r._id} value={r._id}>{r.roomNumber} — {r.roomType} (₹{r.monthlyFee?.toLocaleString('en-IN')}/mo, {r.capacity - r.occupiedCount} beds free)</option>)}
              </select>
              <span className="form-hint">Only available rooms are shown</span>
            </div>
            <div className="form-group">
              <label className="form-label">Allocation Date</label>
              <input className="form-control" type="date" value={form.allocationDate} onChange={e => setForm({...form, allocationDate: e.target.value})} />
            </div>
            <div className="btn-group mt-2">
              <button type="submit" className="btn btn-primary" disabled={!formData.students.length}>Allocate Room</button>
              <Link to="/allocations" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
