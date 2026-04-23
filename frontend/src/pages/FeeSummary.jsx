import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function FeeSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/allocations/fee-summary').then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Failed to load fee summary</h3></div>;

  const { summary, currentMonth, currentYear } = data;
  const overdueCount = summary.filter(s => s.isOverdue).length;

  return (
    <>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>💰 Fee Summary — {currentMonth} {currentYear}</h2>
      </div>

      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat-card blue"><div className="stat-icon">📋</div><div className="stat-value">{summary.length}</div><div className="stat-label">Active Allocations</div></div>
        <div className="stat-card red"><div className="stat-icon">⚠️</div><div className="stat-value">{overdueCount}</div><div className="stat-label">Overdue This Month</div></div>
        <div className="stat-card emerald"><div className="stat-icon">✅</div><div className="stat-value">{summary.length - overdueCount}</div><div className="stat-label">Paid This Month</div></div>
      </div>

      <div className="card">
        <div className="card-body no-padding">
          {!summary.length ? <div className="empty-state"><p>No active allocations.</p></div> : (
            <div className="table-container"><table>
              <thead><tr><th>Student</th><th>Hostel</th><th>Room</th><th>Fee/Month</th><th>Total Due</th><th>Total Paid</th><th>Balance</th><th>{currentMonth} Status</th><th>Action</th></tr></thead>
              <tbody>{summary.map(a => (
                <tr key={a._id} className={a.isOverdue ? 'overdue' : ''}>
                  <td>{a.studentId?.name}</td>
                  <td>{a.hostelId?.name}</td>
                  <td>{a.roomId?.roomNumber}</td>
                  <td>₹{a.roomId?.monthlyFee?.toLocaleString('en-IN')}</td>
                  <td>₹{a.totalFeesDue?.toLocaleString('en-IN')}</td>
                  <td>₹{a.totalFeesPaid?.toLocaleString('en-IN')}</td>
                  <td style={{fontWeight:700, color: a.balance > 0 ? 'var(--accent-red)' : 'var(--accent-emerald)'}}>₹{a.balance?.toLocaleString('en-IN')}</td>
                  <td>{a.isOverdue ? <span className="badge badge-danger">Overdue</span> : <span className="badge badge-success">Paid</span>}</td>
                  <td><Link to={`/allocations/${a._id}/payment`} className="btn btn-outline btn-sm">Pay</Link></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </>
  );
}
