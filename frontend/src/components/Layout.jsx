import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.includes('/hostels')) return 'Hostels';
    if (path.includes('/rooms')) return 'Rooms';
    if (path.includes('/students')) return 'Students';
    if (path.includes('/fee-summary')) return 'Fee Summary';
    if (path.includes('/allocations')) return 'Allocations';
    if (path.includes('/complaints')) return 'Complaints';
    return 'Hostel Manager';
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-brand" style={{ padding: '20px 0', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '10px 15px', borderRadius: '8px', display: 'inline-block' }}>
            <img 
              src="https://www.goodhostspaces.com/wp-content/uploads/2024/03/GHSlogoFinal-011-1-300x147.png.webp" 
              alt="GHS Good Host Spaces Logo" 
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '50px', display: 'block' }} 
            />
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main</div>
          <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>

          <div className="nav-section-title">Management</div>
          <NavLink to="/hostels" className={({isActive}) => `nav-link ${isActive || location.pathname.startsWith('/hostels') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🏢</span> Hostels
          </NavLink>
          <NavLink to="/rooms" className={({isActive}) => `nav-link ${isActive || location.pathname.startsWith('/rooms') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🚪</span> Rooms
          </NavLink>
          <NavLink to="/students" className={({isActive}) => `nav-link ${isActive || location.pathname.startsWith('/students') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🎓</span> Students
          </NavLink>

          <div className="nav-section-title">Operations</div>
          <NavLink to="/allocations" className={() => `nav-link ${location.pathname.startsWith('/allocations') && !location.pathname.includes('fee-summary') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🔑</span> Allocations
          </NavLink>
          <NavLink to="/allocations/fee-summary" className={() => `nav-link ${location.pathname.includes('fee-summary') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">💰</span> Fee Payments
          </NavLink>
          <NavLink to="/complaints" className={({isActive}) => `nav-link ${isActive || location.pathname.startsWith('/complaints') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📋</span> Complaints
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="page-title-section">
              <h1>{getTitle()}</h1>
            </div>
          </div>
          <div className="header-actions">
            <span className="header-date">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:999}} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
