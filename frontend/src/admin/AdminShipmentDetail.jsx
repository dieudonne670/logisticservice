import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import AdminLiveMap from '../map/AdminLiveMap'

export default function AdminShipmentDetail() {
  const { id } = useParams()
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [copied, setCopied] = useState(false)

  const [lat, setLat] = useState('34.0522')
  const [lng, setLng] = useState('-118.2437')
  const [pushing, setPushing] = useState(false)
  const [pushMsg, setPushMsg] = useState('')

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
      const { data } = await client.patch(`/api/shipments/${shipment.tracking_number}/`, {
        status: newStatus,
      })
      setShipment(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  function copyTracking() {
    navigator.clipboard.writeText(shipment.tracking_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function pushLocation(e) {
    e.preventDefault()
    setPushing(true)
    setPushMsg('')
    try {
      await client.post('/api/locations/', {
        shipment_id: shipment.id,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      })
      setPushMsg(`✓ Location sent: ${lat}, ${lng}`)
      setTimeout(() => setPushMsg(''), 3000)
    } catch (err) {
      setPushMsg(`✗ ${err.response?.data?.error || err.message}`)
    } finally {
      setPushing(false)
    }
  }

  function randomStep() {
    // Move the coordinate a bit to simulate movement
    const newLat = (parseFloat(lat) + (Math.random() - 0.5) * 0.1).toFixed(4)
    const newLng = (parseFloat(lng) + (Math.random() - 0.5) * 0.1).toFixed(4)
    setLat(newLat)
    setLng(newLng)
  }

  async function autoMove(steps = 10, intervalMs = 1500) {
    for (let i = 0; i < steps; i++) {
      const newLat = (parseFloat(lat) + (Math.random() - 0.3) * 0.15).toFixed(4)
      const newLng = (parseFloat(lng) + (Math.random() - 0.3) * 0.15).toFixed(4)
      setLat(newLat)
      setLng(newLng)
      try {
        await client.post('/api/locations/', {
          shipment_id: shipment.id,
          latitude: parseFloat(newLat),
          longitude: parseFloat(newLng),
        })
      } catch (err) {
        setPushMsg(`✗ ${err.message}`)
        break
      }
      await new Promise((r) => setTimeout(r, intervalMs))
    }
    setPushMsg('✓ Auto-move complete')
    setTimeout(() => setPushMsg(''), 3000)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'var(--orange)' }}>{error}</div>
  if (!shipment) return null

  return (
    <div>
      <Link to="/admin/dashboard" style={{ fontSize: 14 }}>← Back to shipments</Link>

      <div className="flex-between mt-4" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="tracking-badge">{shipment.tracking_number}</span>
          <button className="btn btn-secondary" onClick={copyTracking} style={{ padding: '6px 12px', fontSize: 12 }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <span className={`status-pill status-${shipment.status}`}>
            {shipment.status.replace('_', ' ')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" disabled={updating || shipment.status === 'pending'} onClick={() => updateStatus('pending')}>
            Mark Pending
          </button>
          <button className="btn btn-secondary" disabled={updating || shipment.status === 'in_transit'} onClick={() => updateStatus('in_transit')}>
            Mark In Transit
          </button>
          <button className="btn" disabled={updating || shipment.status === 'delivered'} onClick={() => updateStatus('delivered')}>
            Mark Delivered
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="card-title">Shipment Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, fontSize: 14 }}>
          <div><div className="text-muted" style={{ fontSize: 12 }}>From</div><div>{shipment.origin}</div></div>
          <div><div className="text-muted" style={{ fontSize: 12 }}>To</div><div>{shipment.destination}</div></div>
          <div><div className="text-muted" style={{ fontSize: 12 }}>Weight</div><div>{shipment.weight} kg</div></div>
          <div><div className="text-muted" style={{ fontSize: 12 }}>Freight</div><div style={{ textTransform: 'capitalize' }}>{shipment.freight_type}</div></div>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="card-title">Push Location (Test Tool)</h2>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Manually send a GPS coordinate for this shipment. It will appear instantly on the
          client's live map and on the map below.
        </p>
        <form onSubmit={pushLocation} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Latitude</label>
            <input className="form-input" value={lat} onChange={(e) => setLat(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Longitude</label>
            <input className="form-input" value={lng} onChange={(e) => setLng(e.target.value)} />
          </div>
          <button type="button" className="btn btn-secondary" onClick={randomStep} disabled={pushing}>
            🎲 Random
          </button>
          <button type="submit" className="btn" disabled={pushing}>
            {pushing ? 'Sending...' : 'Send'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => autoMove(10)} disabled={pushing}>
            ▶ Auto-move (10)
          </button>
        </form>
        {pushMsg && (
          <div style={{ marginTop: 12, fontSize: 13, color: pushMsg.startsWith('✓') ? 'var(--success, #16a34a)' : 'var(--orange)' }}>
            {pushMsg}
          </div>
        )}
      </div>

      <div className="card mt-4">
        <h2 className="card-title">Live Location (Admin View)</h2>
        {token && <AdminLiveMap shipmentId={shipment.id} token={token} />}
      </div>
    </div>
  )
}