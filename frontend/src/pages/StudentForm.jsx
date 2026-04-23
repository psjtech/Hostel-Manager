import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function StudentForm({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({ name:'', email:'', phone:'', studentId:'', course:'', year:'', parentContact:'', address:'' });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/students/${id}`).then(r => { const s = r.data.data.student; setForm({ name:s.name, email:s.email, phone:s.phone, studentId:s.studentId, course:s.course, year:s.year, parentContact:s.parentContact, address:s.address }); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) { await API.put(`/students/${id}`, form); addToast('Student updated'); navigate(`/students/${id}`); }
      else { await API.post('/students', form); addToast('Student added'); navigate('/students'); }
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/students">Students</Link><span className="separator">/</span><span>{isEdit ? 'Edit' : 'Add'}</span></div>
      <div className="card" style={{maxWidth:700}}>
        <div className="card-header"><h2>{isEdit ? '✏️ Edit Student' : '🎓 Add Student'}</h2></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Student ID *</label><input className="form-control" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required placeholder="e.g. SU2026001" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Course *</label><input className="form-control" value={form.course} onChange={e => setForm({...form, course: e.target.value})} required placeholder="e.g. B.Tech CSE" /></div>
              <div className="form-group"><label className="form-label">Year *</label><input className="form-control" type="number" min="1" max="5" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label className="form-label">Parent Contact *</label><input className="form-control" value={form.parentContact} onChange={e => setForm({...form, parentContact: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Address *</label><textarea className="form-control" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required /></div>
            <div className="btn-group mt-2">
              <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Add Student'}</button>
              <Link to="/students" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
