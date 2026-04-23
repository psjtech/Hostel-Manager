import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/api';

export default function ComplaintList({ addToast }) {
  const [data, setData] = useState({ complaints: [], hostels: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = () => {
    const params = Object.fromEntries(searchParams);
    API.get('/complaints', { params }).then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, [searchParams]);

  const updateFilter = (key, val) => { const p = Object.fromEntries(searchParams); if (val) p[key] = val; else delete p[key]; setSearchParams(p); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try { await API.delete(`/complaints/${id}`); addToast('Deleted'); load(); } catch { addToast('Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>📋 Complaints ({data.complaints.length})</h2>
        <Link to="/complaints/add" className="btn btn-primary">+ Raise Complaint</Link>
      </div>

      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat-card blue"><div className="stat-icon">📬</div><div className="stat-value">{data.stats.totalOpen}</div><div className="stat-label">Open</div></div>
        <div className="stat-card amber"><div className="stat-icon">🔧</div><div className="stat-value">{data.stats.totalInProgress}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card emerald"><div className="stat-icon">✅</div><div className="stat-value">{data.stats.resolvedThisMonth}</div><div className="stat-label">Resolved This Month</div></div>
      </div>

      <div className="toolbar">
        <div className="search-box"><span className="search-icon">🔍</span><input placeholder="Search..." value={searchParams.get('search') || ''} onChange={e => updateFilter('search', e.target.value)} /></div>
        <select value={searchParams.get('status') || ''} onChange={e => updateFilter('status', e.target.value)}>
          <option value="">All Status</option><option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
        </select>
        <select value={searchParams.get('category') || ''} onChange={e => updateFilter('category', e.target.value)}>
          <option value="">All Categories</option><option value="maintenance">Maintenance</option><option value="hygiene">Hygiene</option><option value="security">Security</option><option value="food">Food</option><option value="other">Other</option>
        </select>
        <select value={searchParams.get('priority') || ''} onChange={e => updateFilter('priority', e.target.value)}>
          <option value="">All Priority</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
      </div>

      <div className="card">
        <div className="card-body no-padding">
          {!data.complaints.length ? <div className="empty-state"><p>No complaints found.</p></div> : (
            <div className="table-container"><table>
              <thead><tr><th>Title</th><th>Student</th><th>Hostel</th><th>Room</th><th>Category</th><th>Priority</th><th>Status</th><th>Raised On</th><th>Actions</th></tr></thead>
              <tbody>{data.complaints.map(c => (
                <tr key={c._id}>
                  <td><Link to={`/complaints/${c._id}`}>{c.title}</Link></td>
                  <td>{c.studentId?.name || 'N/A'}</td>
                  <td>{c.hostelId?.name || 'N/A'}</td>
                  <td>{c.roomId?.roomNumber || 'N/A'}</td>
                  <td><span className="badge badge-gray">{c.category}</span></td>
                  <td><span className={`badge priority-${c.priority}`}>{c.priority}</span></td>
                  <td><span className={`badge status-${c.status}`}>{c.status}</span></td>
                  <td>{new Date(c.raisedOn).toLocaleDateString('en-IN')}</td>
                  <td><button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm">Delete</button></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </>
  );
}
