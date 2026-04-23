import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function PaymentForm({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alloc, setAlloc] = useState(null);
  const [form, setForm] = useState({ month: '', year: new Date().getFullYear(), amount: '' });
  const [loading, setLoading] = useState(true);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  useEffect(() => {
    API.get(`/allocations/${id}`).then(r => {
      setAlloc(r.data.data);
      setForm(f => ({ ...f, amount: r.data.data.roomId?.monthlyFee || '', month: new Date().toLocaleString('default', { month: 'long' }) }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/allocations/${id}/payment`, form);
      addToast(res.data.message || 'Payment recorded');
      navigate(`/allocations/${id}`);
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!alloc) return <div className="empty-state"><h3>Allocation not found</h3></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/allocations">Allocations</Link><span className="separator">/</span><Link to={`/allocations/${id}`}>Details</Link><span className="separator">/</span><span>Payment</span></div>
      <div className="card" style={{maxWidth:600}}>
        <div className="card-header"><h2>💰 Record Fee Payment</h2></div>
        <div className="card-body">
          <div className="info-box info-blue" style={{marginBottom:20}}>
            ℹ️ Recording payment for <strong>{alloc.studentId?.name}</strong> — Room {alloc.roomId?.roomNumber} at {alloc.hostelId?.name}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Month *</label>
                <select className="form-control" value={form.month} onChange={e => setForm({...form, month: e.target.value})} required>
                  <option value="">-- Select --</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year *</label>
                <input className="form-control" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input className="form-control" type="number" min="1" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
              <span className="form-hint">Room monthly fee: ₹{alloc.roomId?.monthlyFee?.toLocaleString('en-IN')}</span>
            </div>
            <div className="btn-group mt-2">
              <button type="submit" className="btn btn-success">Record Payment</button>
              <Link to={`/allocations/${id}`} className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
