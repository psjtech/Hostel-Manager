import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function AllocationDetail() {
  const { id } = useParams();
  const [alloc, setAlloc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/allocations/${id}`).then(r => { setAlloc(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!alloc) return <div className="empty-state"><h3>Allocation not found</h3><Link to="/allocations" className="btn btn-outline">← Back</Link></div>;

  const balance = alloc.totalFeesDue - alloc.totalFeesPaid;

  return (
    <>
      <div className="breadcrumb"><Link to="/allocations">Allocations</Link><span className="separator">/</span><span>Details</span></div>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>Allocation — {alloc.studentId?.name}</h2>
        {alloc.status === 'active' && <Link to={`/allocations/${id}/payment`} className="btn btn-success">💰 Record Payment</Link>}
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Student</span><span className="detail-value"><Link to={`/students/${alloc.studentId?._id}`}>{alloc.studentId?.name}</Link></span></div>
            <div className="detail-item"><span className="detail-label">Student ID</span><span className="detail-value">{alloc.studentId?.studentId}</span></div>
            <div className="detail-item"><span className="detail-label">Hostel</span><span className="detail-value">{alloc.hostelId?.name}</span></div>
            <div className="detail-item"><span className="detail-label">Room</span><span className="detail-value">{alloc.roomId?.roomNumber} ({alloc.roomId?.roomType})</span></div>
            <div className="detail-item"><span className="detail-label">Allocation Date</span><span className="detail-value">{new Date(alloc.allocationDate).toLocaleDateString('en-IN')}</span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value"><span className={`badge status-${alloc.status}`}>{alloc.status}</span></span></div>
            <div className="detail-item"><span className="detail-label">Total Fees Due</span><span className="detail-value fw-bold">₹{alloc.totalFeesDue?.toLocaleString('en-IN')}</span></div>
            <div className="detail-item"><span className="detail-label">Total Fees Paid</span><span className="detail-value fw-bold" style={{color:'var(--accent-emerald)'}}>₹{alloc.totalFeesPaid?.toLocaleString('en-IN')}</span></div>
            <div className="detail-item"><span className="detail-label">Balance</span><span className="detail-value fw-bold" style={{color: balance > 0 ? 'var(--accent-red)' : 'var(--accent-emerald)'}}>₹{balance.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>💰 Payment History</h2></div>
        <div className="card-body no-padding">
          {!alloc.feesPaid?.length ? <div className="empty-state"><p>No payments recorded.</p></div> : (
            <div className="table-container"><table>
              <thead><tr><th>Month</th><th>Year</th><th>Amount</th><th>Paid On</th><th>Receipt No</th></tr></thead>
              <tbody>{alloc.feesPaid.map((f, i) => (
                <tr key={i}>
                  <td>{f.month}</td><td>{f.year}</td>
                  <td>₹{f.amount?.toLocaleString('en-IN')}</td>
                  <td>{new Date(f.paidOn).toLocaleDateString('en-IN')}</td>
                  <td><span className="badge badge-primary">{f.receiptNo}</span></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </>
  );
}
