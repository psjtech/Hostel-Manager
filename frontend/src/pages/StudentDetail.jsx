import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function StudentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/students/${id}`).then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Student not found</h3><Link to="/students" className="btn btn-outline">← Back</Link></div>;

  const { student, allocations, complaints } = data;

  return (
    <>
      <div className="breadcrumb"><Link to="/students">Students</Link><span className="separator">/</span><span>{student.name}</span></div>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>{student.name}</h2>
        <Link to={`/students/${id}/edit`} className="btn btn-outline">Edit</Link>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Student ID</span><span className="detail-value">{student.studentId}</span></div>
            <div className="detail-item"><span className="detail-label">Email</span><span className="detail-value">{student.email}</span></div>
            <div className="detail-item"><span className="detail-label">Phone</span><span className="detail-value">{student.phone}</span></div>
            <div className="detail-item"><span className="detail-label">Course</span><span className="detail-value">{student.course}</span></div>
            <div className="detail-item"><span className="detail-label">Year</span><span className="detail-value">{student.year}</span></div>
            <div className="detail-item"><span className="detail-label">Parent Contact</span><span className="detail-value">{student.parentContact}</span></div>
            <div className="detail-item"><span className="detail-label">Address</span><span className="detail-value">{student.address}</span></div>
          </div>
        </div>
      </div>

      {allocations?.length > 0 && (
        <div className="card mb-3">
          <div className="card-header"><h2>🔑 Room Allocations</h2></div>
          <div className="card-body no-padding"><div className="table-container"><table>
            <thead><tr><th>Hostel</th><th>Room</th><th>Date</th><th>Status</th><th>Fees Due</th><th>Fees Paid</th></tr></thead>
            <tbody>{allocations.map(a => (
              <tr key={a._id}>
                <td>{a.hostelId?.name}</td>
                <td><Link to={`/allocations/${a._id}`}>{a.roomId?.roomNumber}</Link></td>
                <td>{new Date(a.allocationDate).toLocaleDateString('en-IN')}</td>
                <td><span className={`badge status-${a.status}`}>{a.status}</span></td>
                <td>₹{a.totalFeesDue?.toLocaleString('en-IN')}</td>
                <td>₹{a.totalFeesPaid?.toLocaleString('en-IN')}</td>
              </tr>
            ))}</tbody>
          </table></div></div>
        </div>
      )}

      {complaints?.length > 0 && (
        <div className="card">
          <div className="card-header"><h2>📋 Complaints</h2></div>
          <div className="card-body no-padding"><div className="table-container"><table>
            <thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>{complaints.map(c => (
              <tr key={c._id}>
                <td><Link to={`/complaints/${c._id}`}>{c.title}</Link></td>
                <td><span className="badge badge-gray">{c.category}</span></td>
                <td><span className={`badge priority-${c.priority}`}>{c.priority}</span></td>
                <td><span className={`badge status-${c.status}`}>{c.status}</span></td>
                <td>{new Date(c.raisedOn).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}</tbody>
          </table></div></div>
        </div>
      )}
    </>
  );
}
