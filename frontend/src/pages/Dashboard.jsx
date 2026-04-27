import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { 
  Users, DoorOpen, Key, IndianRupee, AlertTriangle, CheckCircle,
  ArrowRight
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
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-hero-overlay" />
        <div className="dashboard-hero-content">
          <p className="dashboard-kicker">Good Host Spaces</p>
          <h1>Welcome to Good Host Spaces</h1>
          <p>
            Manage room allocation, student records, fees, and complaints in one
            clean and organized dashboard.
          </p>
          <div className="dashboard-hero-actions">
            <Link to="/allocations/add" className="btn btn-primary">Allocate Room</Link>
            <Link to="/students/add" className="btn btn-outline">Add Student</Link>
          </div>
        </div>
      </section>

      <div className="stats-grid dashboard-stats">
        <div className="stat-card purple">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon"><DoorOpen size={24} /></div>
          <div className="stat-value">{stats.availableRooms}</div>
          <div className="stat-label">Rooms Available</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><Key size={24} /></div>
          <div className="stat-value">{stats.activeAllocations}</div>
          <div className="stat-label">Active Allocations</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon"><IndianRupee size={24} /></div>
          <div className="stat-value">₹{stats.feesThisMonth?.toLocaleString('en-IN')}</div>
          <div className="stat-label">Fees This Month</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-value">{stats.openComplaints}</div>
          <div className="stat-label">Open Complaints</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <div className="stat-value">{stats.resolvedThisMonth}</div>
          <div className="stat-label">Resolved This Month</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-card">
          <div className="card-header dashboard-card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body dashboard-actions">
            <Link to="/students/add" className="btn btn-outline">
              <Users size={16} /> Add Student
            </Link>
            <Link to="/rooms/add" className="btn btn-outline">
              <DoorOpen size={16} /> Add Room
            </Link>
            <Link to="/allocations/add" className="btn btn-outline">
              <Key size={16} /> Allocate Room
            </Link>
            <Link to="/complaints/add" className="btn btn-outline">
              <AlertTriangle size={16} /> Raise Complaint
            </Link>
            <Link to="/allocations/fee-summary" className="btn btn-outline">
              <IndianRupee size={16} /> Fee Summary
            </Link>
          </div>
        </div>

        <div className="card dashboard-card">
          <div className="card-header dashboard-card-header dashboard-card-header-split">
            <h2>Recent Complaints</h2>
            <Link to="/complaints" className="btn btn-ghost btn-sm dashboard-view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body no-padding">
            {!recentComplaints?.length ? (
              <div className="empty-state dashboard-empty-state">
                <CheckCircle size={40} opacity={0.2} />
                <p>No recent complaints.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.slice(0, 5).map(c => (
                      <tr key={c._id}>
                        <td className="dashboard-title-cell">
                          <Link to={`/complaints/${c._id}`}>{c.title}</Link>
                          <div>{new Date(c.raisedOn).toLocaleDateString('en-IN')}</div>
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

