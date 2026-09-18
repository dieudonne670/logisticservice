import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function AdminDashboard() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    client
      .get('/api/shipments/')
      .then((res) => setShipments(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = shipments.filter((s) => {
    const q = filter.toLowerCase()
    return (
      s.tracking_number.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q)
    )
  })

  if (loading) return <div>Loading shipments...</div>

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, color: '#1a1d3a' }}>All Shipments</h2>
          <p className="text-muted" style={{ fontSize: 14 }}>{shipments.length} total</p>
        </div>
        <Link to="/admin/shipments/new" className="btn">+ New Shipment</Link>
      </div>

      {error && <div className="card" style={{ color: 'var(--orange)' }}>{error}</div>}

      <div className="card" style={{ marginBottom: 16 }}>
        <input
          className="form-input"
          placeholder="Search by tracking number, origin, or destination..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p className="text-muted">
            {shipments.length === 0
              ? "No shipments yet. Create your first one."
              : 'No shipments match your search.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((s) => (
            <div key={s.id} className="card">
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span className="tracking-badge">{s.tracking_number}</span>
                  <span className={`status-pill status-${s.status}`}>
                    {s.status.replace('_', ' ')}
                  </span>
                  <span className="text-muted" style={{ fontSize: 13, textTransform: 'capitalize' }}>
                    {s.freight_type} freight
                  </span>
                </div>
                <Link to={`/admin/shipments/${s.id}`} className="btn btn-secondary">
                  View & Manage
                </Link>
              </div>
              <div
                className="mt-4"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, fontSize: 14 }}
              >
                <div>
                  <div className="text-muted" style={{ fontSize: 12 }}>From</div>
                  <div>{s.origin}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: 12 }}>To</div>
                  <div>{s.destination}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: 12 }}>Weight</div>
                  <div>{s.weight} kg</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: 12 }}>Created</div>
                  <div>{new Date(s.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}