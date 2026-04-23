import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function HostelForm({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({ name: '', address: '', totalRooms: '', type: 'boys', wardenName: '', wardenContact: '' });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/hostels/${id}`).then(r => {
        const h = r.data.data.hostel;
        setForm({ name: h.name, address: h.address, totalRooms: h.totalRooms, type: h.type, wardenName: h.warden?.name || '', wardenContact: h.warden?.contact || '' });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/hostels/${id}`, form);
        addToast('Hostel updated successfully');
        navigate(`/hostels/${id}`);
      } else {
        await API.post('/hostels', form);
        addToast('Hostel added successfully');
        navigate('/hostels');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save hostel', 'error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/hostels">Hostels</Link><span className="separator">/</span><span>{isEdit ? 'Edit' : 'Add'}</span></div>
      <div className="card" style={{maxWidth:700}}>
        <div className="card-header"><h2>{isEdit ? '✏️ Edit Hostel' : '🏢 Add Hostel'}</h2></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Hostel Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Shoolini Residences (Boys Block)" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="boys">Boys</option><option value="girls">Girls</option><option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Rooms *</label>
                <input className="form-control" type="number" min="1" value={form.totalRooms} onChange={e => setForm({...form, totalRooms: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input className="form-control" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required placeholder="Full address" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Warden Name *</label>
                <input className="form-control" value={form.wardenName} onChange={e => setForm({...form, wardenName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Warden Contact *</label>
                <input className="form-control" value={form.wardenContact} onChange={e => setForm({...form, wardenContact: e.target.value})} required />
              </div>
            </div>
            <div className="btn-group mt-2">
              <button type="submit" className="btn btn-primary">{isEdit ? 'Update Hostel' : 'Add Hostel'}</button>
              <Link to="/hostels" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
