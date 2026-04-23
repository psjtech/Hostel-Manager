import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function ComplaintDetail({ addToast }) {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({ status: '', adminRemarks: '' });

  const load = () => {
    API.get(`/complaints/${id}`).then(r => {
      setComplaint(r.data.data);
      setStatusForm({ status: r.data.data.status, adminRemarks: r.data.data.adminRemarks || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(load, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try { await API.patch(`/complaints/${id}/status`, statusForm); addToast('Status updated'); load(); }
    catch { addToast('Failed to update', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!complaint) return <div className="empty-state"><h3>Complaint not found</h3><Link to="/complaints" className="btn btn-outline">← Back</Link></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/complaints">Complaints</Link><span className="separator">/</span><span>{complaint.title}</span></div>
      <div className="card mb-3">
        <div className="card-header"><h2>{complaint.title}</h2></div>
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Student</span><span className="detail-value"><Link to={`/students/${complaint.studentId?._id}`}>{complaint.studentId?.name}</Link></span></div>
            <div className="detail-item"><span className="detail-label">Hostel</span><span className="detail-value">{complaint.hostelId?.name}</span></div>
            <div className="detail-item"><span className="detail-label">Room</span><span className="detail-value">{complaint.roomId?.roomNumber}</span></div>
            <div className="detail-item"><span className="detail-label">Category</span><span className="detail-value"><span className="badge badge-gray">{complaint.category}</span></span></div>
            <div className="detail-item"><span className="detail-label">Priority</span><span className="detail-value"><span className={`badge priority-${complaint.priority}`}>{complaint.priority}</span></span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value"><span className={`badge status-${complaint.status}`}>{complaint.status}</span></span></div>
            <div className="detail-item"><span className="detail-label">Raised On</span><span className="detail-value">{new Date(complaint.raisedOn).toLocaleDateString('en-IN')}</span></div>
            {complaint.resolvedOn && <div className="detail-item"><span className="detail-label">Resolved On</span><span className="detail-value">{new Date(complaint.resolvedOn).toLocaleDateString('en-IN')}</span></div>}
          </div>
          <div style={{marginTop:20}}>
            <span className="detail-label">Description</span>
            <p style={{marginTop:6, color:'var(--text-secondary)', lineHeight:1.7}}>{complaint.description}</p>
          </div>
          {complaint.adminRemarks && <div style={{marginTop:16}}>
            <span className="detail-label">Admin Remarks</span>
            <p style={{marginTop:6, color:'var(--accent-blue)', lineHeight:1.7}}>{complaint.adminRemarks}</p>
          </div>}
        </div>
      </div>

      <div className="card" style={{maxWidth:600}}>
        <div className="card-header"><h2>🔧 Update Status</h2></div>
        <div className="card-body">
          <form onSubmit={handleStatusUpdate}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={statusForm.status} onChange={e => setStatusForm({...statusForm, status: e.target.value})}>
                <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Admin Remarks</label>
              <textarea className="form-control" value={statusForm.adminRemarks} onChange={e => setStatusForm({...statusForm, adminRemarks: e.target.value})} placeholder="Add remarks about this complaint..." />
            </div>
            <button type="submit" className="btn btn-primary">Update Status</button>
          </form>
        </div>
      </div>
    </>
  );
}
