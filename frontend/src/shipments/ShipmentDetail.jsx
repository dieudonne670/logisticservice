import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import AdminLiveMap from '../map/AdminLiveMap'

export default function ShipmentDetail() {
  const { id } = useParams()
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  const token = localStorage.getItem('access_token')

  useEffect(() => {
    client
      .get(`/api/shipments/${id}/by-id/`)
      .then((res) => setShipment(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function updateStatus(newStatus) {
    setUpdating(true)
    try {
      const { data } = await client.get(`/api/shipments/public/${trackingNumber}/`, {
        status: newStatus,
      })
      setShipment(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="container mt-4">Loading...</div>
  if (error) return <div className="container mt-4" style={{ color: 'var(--orange)' }}>{error}</div>
  if (!shipment) return null

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <Link to="/dashboard" style={{ fontSize: 14 }}>← Back to shipments</Link>

      <div className="flex-between mt-4" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="tracking-badge">{shipment.tracking_number}</span>
          <span className={`status-pill status-${shipment.status}`}>
            {shipment.status.replace('_', ' ')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            disabled={updating || shipment.status === 'pending'}
            onClick={() => updateStatus('pending')}
          >
            Mark Pending
          </button>
          <button
            className="btn btn-secondary"
            disabled={updating || shipment.status === 'in_transit'}
            onClick={() => updateStatus('in_transit')}
          >
            Mark In Transit
          </button>
          <button
            className="btn"
            disabled={updating || shipment.status === 'delivered'}
            onClick={() => updateStatus('delivered')}
          >
            Mark Delivered
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="card-title">Shipment Details</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            fontSize: 14,
          }}
        >
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>From</div>
            <div>{shipment.origin}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>To</div>
            <div>{shipment.destination}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Weight</div>
            <div>{shipment.weight} kg</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Freight Type</div>
            <div style={{ textTransform: 'capitalize' }}>{shipment.freight_type}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Length</div>
            <div>{shipment.length} m</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Width</div>
            <div>{shipment.width} m</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Height</div>
            <div>{shipment.height} m</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Created</div>
            <div>{new Date(shipment.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="card-title">Live Location (Admin View)</h2>
        {token && <AdminLiveMap shipmentId={shipment.id} token={token} />}
      </div>
    </div>
  )
}