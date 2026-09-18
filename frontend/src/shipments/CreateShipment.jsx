import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function CreateShipment() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    height: '',
    length: '',
    width: '',
    freight_type: 'land',
  })
  const [created, setCreated] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await client.post('/api/shipments/', {
        ...form,
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        length: parseFloat(form.length),
        width: parseFloat(form.width),
      })
      setCreated(data)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || { error: err.message }))
    } finally {
      setSubmitting(false)
    }
  }

  if (created) {
    return (
      <div className="container mt-4" style={{ maxWidth: 640 }}>
        <div className="card">
          <h1 className="card-title" style={{ color: 'var(--success)' }}>
            ✓ Shipment created
          </h1>
          <p className="text-muted">Share this tracking number with your customer:</p>
          <div className="mt-4" style={{ textAlign: 'center' }}>
            <span className="tracking-badge" style={{ fontSize: 22, padding: '12px 24px' }}>
              {created.tracking_number}
            </span>
          </div>
          <div className="flex gap-2 mt-4" style={{ justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setCreated(null)}>
              Create another
            </button>
            <button className="btn" onClick={() => navigate(`/track?tn=${created.tracking_number}`)}>
              Track it now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 640 }}>
      <h1 style={{ marginBottom: 24 }}>New Shipment</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Freight Type</label>
          <select className="form-select" value={form.freight_type} onChange={update('freight_type')}>
            <option value="land">Land Freight</option>
            <option value="air">Air Freight</option>
            <option value="sea">Sea Freight</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Origin</label>
          <input className="form-input" value={form.origin} onChange={update('origin')} placeholder="Atlanta, GA" required />
        </div>

        <div className="form-group">
          <label className="form-label">Destination</label>
          <input className="form-input" value={form.destination} onChange={update('destination')} placeholder="New York, USA" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Weight (Ibs)</label>
            <input className="form-input" type="number" step="0.1" value={form.weight} onChange={update('weight')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Length (m)</label>
            <input className="form-input" type="number" step="0.1" value={form.length} onChange={update('length')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Width (m)</label>
            <input className="form-input" type="number" step="0.1" value={form.width} onChange={update('width')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Height (m)</label>
            <input className="form-input" type="number" step="0.1" value={form.height} onChange={update('height')} required />
          </div>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</div>}

        <button className="btn" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Shipment'}
        </button>
      </form>
    </div>
  )
}