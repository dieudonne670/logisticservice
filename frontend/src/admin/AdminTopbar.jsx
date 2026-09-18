import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function AdminTopbar({ title, onMenuClick }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="admin-mobile-toggle" onClick={onMenuClick}>☰</button>
        <h1>{title}</h1>
      </div>
      <div className="admin-topbar-right">
        <span className="admin-user">
          Signed in as <strong>admin</strong>
        </span>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}