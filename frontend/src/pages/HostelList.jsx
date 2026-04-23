import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function HostelList({ addToast }) {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    API.get('/hostels').then(r => { setHostels(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its rooms? This cannot be undone.`)) return;
    try {
      await API.delete(`/hostels/${id}`);
      addToast('Hostel deleted successfully');
      load();
    } catch { addToast('Failed to delete hostel', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>🏢 All Hostels ({hostels.length})</h2>
        <Link to="/hostels/add" className="btn btn-primary">+ Add Hostel</Link>
      </div>

      {!hostels.length ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">🏢</div><h3>No hostels yet</h3><p>Add your first hostel to get started.</p><Link to="/hostels/add" className="btn btn-primary">+ Add Hostel</Link></div></div>
      ) : (
        <div className="card">
          <div className="card-body no-padding">
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>Type</th><th>Warden</th><th>Total Rooms</th><th>Available</th><th>Occupied</th><th>Actions</th></tr></thead>
                <tbody>
                  {hostels.map(h => (
                    <tr key={h._id}>
                      <td><Link to={`/hostels/${h._id}`}>{h.name}</Link></td>
                      <td><span className={`badge type-${h.type}`}>{h.type}</span></td>
                      <td>{h.warden?.name}</td>
                      <td>{h.roomCount || h.totalRooms}</td>
                      <td><span className="badge badge-success">{h.availableRooms || 0}</span></td>
                      <td><span className="badge badge-danger">{h.occupiedRooms || 0}</span></td>
                      <td>
                        <div className="btn-group">
                          <Link to={`/hostels/${h._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                          <button onClick={() => handleDelete(h._id, h.name)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
