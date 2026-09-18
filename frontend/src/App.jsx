import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Login from './auth/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import TrackShipment from './shipments/TrackShipment'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminCreateShipment from './admin/AdminCreateShipment'
import AdminShipmentDetail from './admin/AdminShipmentDetail'
import AdminLocations from './admin/AdminLocations'
import AdminMessages from './admin/AdminMessages'
import AdminSettings from './admin/AdminSettings'
import './styles/admin.css'


function PublicShell({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <FloatingContact />
      <Footer />
    </>
  )
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicShell><Home /></PublicShell>} />
          <Route path="/about" element={<PublicShell><About /></PublicShell>} />
          <Route path="/services" element={<PublicShell><Services /></PublicShell>} />
          <Route path="/contact" element={<PublicShell><Contact /></PublicShell>} />
          <Route path="/track" element={<PublicShell><TrackShipment /></PublicShell>} />
          <Route path="/login" element={<PublicShell><Login /></PublicShell>} />

          {/* Admin — protected, with its own layout (no public chrome) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="shipments/new" element={<AdminCreateShipment />} />
            <Route path="shipments/:id" element={<AdminShipmentDetail />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}