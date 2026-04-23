import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/api';

export default function AllocationList({ addToast }) {
  const [data, setData] = useState({ allocations: [], hostels: [] });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = () => {
    const params = Object.fromEntries(searchParams);
    API.get('/allocations', { params }).then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, [searchParams]);

  const updateFilter = (key, val) => { const p = Object.fromEntries(searchParams); if (val) p[key] = val; else delete p[key]; setSearchParams(p); };

  const handleVacate = async (id) => {
    if (!confirm('Vacate this student from their room?')) return;
    try { await API.patch(`/allocations/${id}/vacate`); addToast('Room vacated'); load(); } catch { addToast('Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>🔑 Room Allocations ({data.allocations.length})</h2>
        <Link to="/allocations/add" className="btn btn-primary">+ Allocate Room</Link>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search student..." value={searchParams.get('search') || ''} onChange={e => updateFilter('search', e.target.value)} />
        </div>
        <select value={searchParams.get('hostel') || ''} onChange={e => updateFilter('hostel', e.target.value)}>
          <option value="">All Hostels</option>
          {data.hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <select value={searchParams.get('status') || ''} onChange={e => updateFilter('status', e.target.value)}>
          <option value="">All Status</option><option value="active">Active</option><option value="vacated">Vacated</option>
        </select>
      </div>
      <div className="card">
        <div className="card-body no-padding">
          {!data.allocations.length ? <div className="empty-state"><p>No allocations found.</p></div> : (
            <div className="table-container"><table>
              <thead><tr><th>Student</th><th>Hostel</th><th>Room</th><th>Type</th><th>Date</th><th>Fees Due</th><th>Fees Paid</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{data.allocations.map(a => (
                <tr key={a._id}>
                  <td><Link to={`/allocations/${a._id}`}>{a.studentId?.name || 'N/A'}</Link></td>
                  <td>{a.hostelId?.name || 'N/A'}</td>
                  <td>{a.roomId?.roomNumber || 'N/A'}</td>
                  <td><span className="badge badge-gray">{a.roomId?.roomType}</span></td>
                  <td>{new Date(a.allocationDate).toLocaleDateString('en-IN')}</td>
                  <td>₹{a.totalFeesDue?.toLocaleString('en-IN')}</td>
                  <td>₹{a.totalFeesPaid?.toLocaleString('en-IN')}</td>
                  <td><span className={`badge status-${a.status}`}>{a.status}</span></td>
                  <td>
                    <div className="btn-group">
                      {a.status === 'active' && <>
                        <Link to={`/allocations/${a._id}/payment`} className="btn btn-success btn-sm">Pay</Link>
                        <button onClick={() => handleVacate(a._id)} className="btn btn-warning btn-sm">Vacate</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </>
  );
}
