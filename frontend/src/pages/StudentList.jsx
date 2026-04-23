import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/api';

export default function StudentList({ addToast }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = () => {
    const params = Object.fromEntries(searchParams);
    API.get('/students', { params }).then(r => { setStudents(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, [searchParams]);

  const updateFilter = (key, val) => { const p = Object.fromEntries(searchParams); if (val) p[key] = val; else delete p[key]; setSearchParams(p); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try { await API.delete(`/students/${id}`); addToast('Student deleted'); load(); } catch { addToast('Failed', 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="flex-between mb-3">
        <h2 className="section-title" style={{marginBottom:0}}>🎓 All Students ({students.length})</h2>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Search name, ID, email..." value={searchParams.get('search') || ''} onChange={e => updateFilter('search', e.target.value)} />
        </div>
        <select value={searchParams.get('year') || ''} onChange={e => updateFilter('year', e.target.value)}>
          <option value="">All Years</option><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
        </select>
      </div>
      <div className="card">
        <div className="card-body no-padding">
          {!students.length ? <div className="empty-state"><p>No students found.</p></div> : (
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>Student ID</th><th>Course</th><th>Year</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td><Link to={`/students/${s._id}`}>{s.name}</Link></td>
                      <td>{s.studentId}</td>
                      <td>{s.course}</td>
                      <td>{s.year}</td>
                      <td>{s.phone}</td>
                      <td style={{fontSize:'0.8rem'}}>{s.email}</td>
                      <td>
                        <div className="btn-group">
                          <Link to={`/students/${s._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                          <button onClick={() => handleDelete(s._id)} className="btn btn-danger btn-sm">Delete</button>
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
