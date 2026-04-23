import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function RoomForm({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [hostels, setHostels] = useState([]);
  const [form, setForm] = useState({ hostelId: '', roomNumber: '', floor: '', capacity: '', roomType: 'double', monthlyFee: '', status: 'available' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = [API.get('/hostels')];
    if (isEdit) promises.push(API.get(`/rooms/${id}`));
    Promise.all(promises).then(([hRes, rRes]) => {
      setHostels(hRes.data.data);
      if (rRes) {
        const r = rRes.data.data;
        setForm({ hostelId: r.hostelId?._id || r.hostelId, roomNumber: r.roomNumber, floor: r.floor, capacity: r.capacity, roomType: r.roomType, monthlyFee: r.monthlyFee, status: r.status });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) { await API.put(`/rooms/${id}`, form); addToast('Room updated'); navigate(`/rooms/${id}`); }
      else { await API.post('/rooms', form); addToast('Room added'); navigate('/rooms'); }
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/rooms">Rooms</Link><span className="separator">/</span><span>{isEdit ? 'Edit' : 'Add'}</span></div>
      <div className="card" style={{maxWidth:700}}>
        <div className="card-header"><h2>{isEdit ? '✏️ Edit Room' : '🚪 Add Room'}</h2></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Hostel *</label>
              <select className="form-control" value={form.hostelId} onChange={e => setForm({...form, hostelId: e.target.value})} required>
                <option value="">-- Select Hostel --</option>
                {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Room Number *</label><input className="form-control" value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} required placeholder="e.g. SRB-101" /></div>
              <div className="form-group"><label className="form-label">Floor *</label><input className="form-control" type="number" min="0" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Room Type *</label>
                <select className="form-control" value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value})}><option value="single">Single</option><option value="double">Double</option><option value="triple">Triple</option></select>
              </div>
              <div className="form-group"><label className="form-label">Capacity *</label><input className="form-control" type="number" min="1" max="4" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Monthly Fee (₹) *</label><input className="form-control" type="number" min="0" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="available">Available</option><option value="full">Full</option><option value="maintenance">Maintenance</option></select>
              </div>
            </div>
            <div className="btn-group mt-2">
              <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Add Room'}</button>
              <Link to="/rooms" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
