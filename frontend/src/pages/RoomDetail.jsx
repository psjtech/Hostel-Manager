import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/rooms/${id}`).then(r => { setRoom(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!room) return <div className="empty-state"><h3>Room not found</h3><Link to="/rooms" className="btn btn-outline">← Back</Link></div>;

  return (
    <>
      <div className="breadcrumb"><Link to="/rooms">Rooms</Link><span className="separator">/</span><span>{room.roomNumber}</span></div>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>Room {room.roomNumber}</h2>
        <Link to={`/rooms/${id}/edit`} className="btn btn-outline">Edit Room</Link>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Hostel</span><span className="detail-value">{room.hostelId?.name || 'N/A'}</span></div>
            <div className="detail-item"><span className="detail-label">Floor</span><span className="detail-value">{room.floor}</span></div>
            <div className="detail-item"><span className="detail-label">Room Type</span><span className="detail-value"><span className="badge badge-gray">{room.roomType}</span></span></div>
            <div className="detail-item"><span className="detail-label">Capacity</span><span className="detail-value">{room.capacity}</span></div>
            <div className="detail-item"><span className="detail-label">Occupied</span><span className="detail-value">{room.occupiedCount}</span></div>
            <div className="detail-item"><span className="detail-label">Monthly Fee</span><span className="detail-value">₹{room.monthlyFee?.toLocaleString('en-IN')}</span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value"><span className={`badge status-${room.status}`}>{room.status}</span></span></div>
          </div>
        </div>
      </div>
    </>
  );
}
