import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { 
  Users, DoorOpen, Key, IndianRupee, AlertTriangle, CheckCircle, 
  Plus, FileText, ArrowRight 
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard').then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Failed to load dashboard</h3></div>;

  const { stats, recentComplaints } = data;

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon"><Users size={22} /></div>
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon"><DoorOpen size={22} /></div>
          <div className="stat-value">{stats.availableRooms}</div>
          <div className="stat-label">Rooms Available</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><Key size={22} /></div>
          <div className="stat-value">{stats.activeAllocations}</div>
          <div className="stat-label">Active Allocations</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon"><IndianRupee size={22} /></div>
          <div className="stat-value">₹{stats.feesThisMonth?.toLocaleString('en-IN')}</div>
          <div className="stat-label">Fees This Month</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><AlertTriangle size={22} /></div>
          <div className="stat-value">{stats.openComplaints}</div>
          <div className="stat-label">Open Complaints</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon"><CheckCircle size={22} /></div>
          <div className="stat-value">{stats.resolvedThisMonth}</div>
          <div className="stat-label">Resolved This Month</div>
        </div>
      </div>

      <div className="dashboard-sections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
        
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="var(--text-muted)" /> Quick Actions
            </h2>
          </div>
          <div className="card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/students/add" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}><Users size={16} /> Add Student</Link>
            <Link to="/rooms/add" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}><DoorOpen size={16} /> Add Room</Link>
            <Link to="/allocations/add" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}><Key size={16} /> Allocate Room</Link>
            <Link to="/complaints/add" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}><AlertTriangle size={16} /> Raise Complaint</Link>
            <Link to="/allocations/fee-summary" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}><IndianRupee size={16} /> Fee Summary</Link>
          </div>
        </div>

        <div className="card" style={{ flex: 2 }}>
          <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--text-muted)" /> Recent Complaints
            </h2>
            <Link to="/complaints" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>View All <ArrowRight size={14} /></Link>
          </div>
          <div className="card-body no-padding">
            {!recentComplaints?.length ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <CheckCircle size={40} opacity={0.2} style={{ marginBottom: '16px' }} />
                <p style={{ margin: 0 }}>No recent complaints.</p>
              </div>
            ) : (
              <div className="table-container">
                <table style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '16px 24px' }}>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.slice(0, 5).map(c => (
                      <tr key={c._id}>
                        <td style={{ padding: '16px 24px' }}>
                          <Link to={`/complaints/${c._id}`} style={{ fontWeight: 500 }}>{c.title}</Link>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(c.raisedOn).toLocaleDateString('en-IN')}</div>
                        </td>
                        <td><span className="badge badge-gray">{c.category}</span></td>
                        <td><span className={`badge priority-${c.priority}`}>{c.priority}</span></td>
                        <td><span className={`badge status-${c.status}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
