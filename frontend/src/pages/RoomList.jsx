import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/api';

export default function RoomList({ addToast }) {
  const [data, setData] = useState({ rooms: [], hostels: [] });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = () => {
    const params = Object.fromEntries(searchParams);
    API.get('/rooms', { params }).then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, [searchParams]);

  const updateFilter = (key, val) => {
    const p = Object.fromEntries(searchParams);
    if (val) p[key] = val; else delete p[key];
    setSearchParams(p);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    try { await API.delete(`/rooms/${id}`); addToast('Room deleted'); load(); } catch { addToast('Failed to delete', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>🚪 All Rooms ({data.rooms.length})</h2>
        <Link to="/rooms/add" className="btn btn-primary">+ Add Room</Link>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search room number..." value={searchParams.get('search') || ''} onChange={e => updateFilter('search', e.target.value)} />
        </div>
        <select value={searchParams.get('hostel') || ''} onChange={e => updateFilter('hostel', e.target.value)}>
          <option value="">All Hostels</option>
          {data.hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <select value={searchParams.get('status') || ''} onChange={e => updateFilter('status', e.target.value)}>
          <option value="">All Status</option><option value="available">Available</option><option value="full">Full</option><option value="maintenance">Maintenance</option>
        </select>
        <select value={searchParams.get('roomType') || ''} onChange={e => updateFilter('roomType', e.target.value)}>
          <option value="">All Types</option><option value="single">Single</option><option value="double">Double</option><option value="triple">Triple</option>
        </select>
      </div>
      <div className="card">
        <div className="card-body no-padding">
          {!data.rooms.length ? <div className="empty-state"><p>No rooms found.</p></div> : (
            <div className="table-container">
              <table>
                <thead><tr><th>Room No</th><th>Hostel</th><th>Floor</th><th>Type</th><th>Capacity</th><th>Occupied</th><th>Fee/Month</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.rooms.map(r => (
                    <tr key={r._id}>
                      <td><Link to={`/rooms/${r._id}`}>{r.roomNumber}</Link></td>
                      <td>{r.hostelId?.name || 'N/A'}</td>
                      <td>{r.floor}</td>
                      <td><span className="badge badge-gray">{r.roomType}</span></td>
                      <td>{r.capacity}</td>
                      <td>{r.occupiedCount}</td>
                      <td>₹{r.monthlyFee?.toLocaleString('en-IN')}</td>
                      <td><span className={`badge status-${r.status}`}>{r.status}</span></td>
                      <td>
                        <div className="btn-group">
                          <Link to={`/rooms/${r._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                          <button onClick={() => handleDelete(r._id)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
