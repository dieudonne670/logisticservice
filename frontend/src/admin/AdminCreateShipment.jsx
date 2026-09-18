import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function AdminCreateShipment() {
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    height: '',
    length: '',
    width: '',
    freight_type: 'land',
    shipper_name: '',
    shipper_address: '',
    shipper_phone: '',
    shipper_email: '',
    receiver_name: '',
    receiver_address: '',
    receiver_phone: '',
    receiver_email: '',
  })
  const [created, setCreated] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

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

  function copyTracking() {
    navigator.clipboard.writeText(created.tracking_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div className="card">
          <h2 className="card-title" style={{ color: 'var(--success, #16a34a)' }}>✓ Shipment created</h2>
          <p className="text-muted">
            Send this tracking number to the client. They can view the receipt and live map at
            <code> /track?tn={created.tracking_number}</code>
          </p>
          <div className="mt-4" style={{ textAlign: 'center' }}>
            <span className="tracking-badge" style={{ fontSize: 20, padding: '12px 24px' }}>
              {created.tracking_number}
            </span>
          </div>
          <div className="flex gap-2 mt-4" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={copyTracking}>
              {copied ? '✓ Copied' : 'Copy tracking number'}
            </button>
            <Link to={`/admin/shipments/${created.id}`} className="btn">Open shipment</Link>
            <button className="btn btn-secondary" onClick={() => setCreated(null)}>Create another</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <form className="card" onSubmit={handleSubmit}>
        <h2 className="card-title">Shipment</h2>
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
          <input className="form-input" value={form.origin} onChange={update('origin')} placeholder="Los Angeles, CA" required />
        </div>
        <div className="form-group">
          <label className="form-label">Destination</label>
          <input className="form-input" value={form.destination} onChange={update('destination')} placeholder="New York, NY" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group"><label className="form-label">Weight (kg)</label><input className="form-input" type="number" step="0.1" value={form.weight} onChange={update('weight')} required /></div>
          <div className="form-group"><label className="form-label">Length (m)</label><input className="form-input" type="number" step="0.1" value={form.length} onChange={update('length')} required /></div>
          <div className="form-group"><label className="form-label">Width (m)</label><input className="form-input" type="number" step="0.1" value={form.width} onChange={update('width')} required /></div>
          <div className="form-group"><label className="form-label">Height (m)</label><input className="form-input" type="number" step="0.1" value={form.height} onChange={update('height')} required /></div>
        </div>

        <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 16, color: '#1a1d3a' }}>Shipper Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.shipper_name} onChange={update('shipper_name')} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.shipper_phone} onChange={update('shipper_phone')} /></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.shipper_address} onChange={update('shipper_address')} /></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.shipper_email} onChange={update('shipper_email')} /></div>

        <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 16, color: '#1a1d3a' }}>Receiver Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.receiver_name} onChange={update('receiver_name')} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.receiver_phone} onChange={update('receiver_phone')} /></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.receiver_address} onChange={update('receiver_address')} /></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.receiver_email} onChange={update('receiver_email')} /></div>

        {error && <div style={{ color: 'var(--orange)', marginTop: 12, fontSize: 13 }}>{error}</div>}
        <button className="btn" style={{ marginTop: 16 }} disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Shipment'}
        </button>
      </form>
    </div>
  )
}