import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function HostelDetail({ addToast }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/hostels/${id}`).then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Hostel not found</h3><Link to="/hostels" className="btn btn-outline">← Back</Link></div>;

  const { hostel, rooms } = data;

  return (
    <>
      <div className="breadcrumb"><Link to="/hostels">Hostels</Link><span className="separator">/</span><span>{hostel.name}</span></div>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>{hostel.name}</h2>
        <Link to={`/hostels/${id}/edit`} className="btn btn-outline">Edit Hostel</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Type</span><span className="detail-value"><span className={`badge type-${hostel.type}`}>{hostel.type}</span></span></div>
            <div className="detail-item"><span className="detail-label">Address</span><span className="detail-value">{hostel.address}</span></div>
            <div className="detail-item"><span className="detail-label">Warden</span><span className="detail-value">{hostel.warden?.name}</span></div>
            <div className="detail-item"><span className="detail-label">Warden Contact</span><span className="detail-value">{hostel.warden?.contact}</span></div>
            <div className="detail-item"><span className="detail-label">Total Rooms</span><span className="detail-value">{hostel.totalRooms}</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>🚪 Rooms ({rooms.length})</h2><Link to="/rooms/add" className="btn btn-primary btn-sm">+ Add Room</Link></div>
        <div className="card-body no-padding">
          {!rooms.length ? <div className="empty-state"><p>No rooms in this hostel.</p></div> : (
            <div className="table-container">
              <table>
                <thead><tr><th>Room No</th><th>Floor</th><th>Type</th><th>Capacity</th><th>Occupied</th><th>Fee/Month</th><th>Status</th></tr></thead>
                <tbody>
                  {rooms.map(r => (
                    <tr key={r._id}>
                      <td><Link to={`/rooms/${r._id}`}>{r.roomNumber}</Link></td>
                      <td>{r.floor}</td>
                      <td><span className="badge badge-gray">{r.roomType}</span></td>
                      <td>{r.capacity}</td>
                      <td>{r.occupiedCount}</td>
                      <td>₹{r.monthlyFee?.toLocaleString('en-IN')}</td>
                      <td><span className={`badge status-${r.status}`}>{r.status}</span></td>
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
