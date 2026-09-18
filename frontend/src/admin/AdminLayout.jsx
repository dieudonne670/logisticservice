import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-shell">
      <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Admin Console" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}