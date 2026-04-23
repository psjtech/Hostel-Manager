import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function ComplaintForm({ addToast }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ students: [], hostels: [], rooms: [] });
  const [form, setForm] = useState({ studentId: '', hostelId: '', roomId: '', title: '', description: '', category: 'maintenance', priority: 'medium' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/complaints/form-data').then(r => { setFormData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filteredRooms = form.hostelId ? formData.rooms.filter(r => (r.hostelId?._id || r.hostelId) === form.hostelId) : formData.rooms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post('/complaints', form); addToast('Complaint raised'); navigate('/complaints'); }
    catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/complaints">Complaints</Link><span className="separator">/</span><span>Raise Complaint</span></div>
      <div className="card" style={{maxWidth:700}}>
        <div className="card-header"><h2>📋 Raise Complaint</h2></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student *</label>
              <select className="form-control" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required>
                <option value="">-- Select Student --</option>
                {formData.students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hostel *</label>
                <select className="form-control" value={form.hostelId} onChange={e => setForm({...form, hostelId: e.target.value, roomId: ''})} required>
                  <option value="">-- Select --</option>
                  {formData.hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Room *</label>
                <select className="form-control" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} required>
                  <option value="">-- Select --</option>
                  {filteredRooms.map(r => <option key={r._id} value={r._id}>{r.roomNumber}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Brief summary of the issue" /></div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Detailed description..." /></div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="maintenance">Maintenance</option><option value="hygiene">Hygiene</option><option value="security">Security</option><option value="food">Food</option><option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select className="form-control" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="btn-group mt-2">
              <button type="submit" className="btn btn-primary">Raise Complaint</button>
              <Link to="/complaints" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
