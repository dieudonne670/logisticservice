import { NavLink, Link } from 'react-router-dom'

export default function AdminSidebar({ open, onNavigate }) {
  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        LOGISTIC<span>SERVICE</span>
      </div>

      <nav className="admin-nav" onClick={onNavigate}>
        <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">▤</span> Dashboard
        </NavLink>
        <NavLink to="/admin/shipments/new" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">＋</span> New Shipment
        </NavLink>
        <NavLink to="/admin/locations" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">◉</span> Locations
        </NavLink>
        <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">✉</span> Messages
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">⚙</span> Settings
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/">← Back to public site</Link>
      </div>
    </aside>
  )
}