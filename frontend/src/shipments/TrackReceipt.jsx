import { forwardRef } from 'react'

const TrackReceipt = forwardRef(function TrackReceipt({ shipment }, ref) {
  function renderBarcode(value) {
    const bars = []
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      const width = (code % 3) + 1
      bars.push(
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: width * 2,
            height: 60,
            background: '#000',
            marginRight: 2,
          }}
        />
      )
    }
    return bars
  }

  return (
    <div ref={ref} className="receipt" style={{ background: '#ffffff', color: '#000000' }}>
      {/* Logo */}
      <div className="receipt-logo">
        <img src="/logo.png" alt="Logisticservice" className="receipt-logo-img" />
      </div>

      {/* Barcode */}
      <div className="receipt-barcode">{renderBarcode(shipment.tracking_number)}</div>
      <div className="receipt-tracking">{shipment.tracking_number}</div>

      {/* Shipper */}
      <div className="receipt-section">
        <h3>Shipper Information</h3>
        <p>{shipment.shipper_name || '—'}</p>
        <p>{shipment.shipper_address || '—'}</p>
        <p>{shipment.shipper_phone || '—'}</p>
        <p>{shipment.shipper_email || '—'}</p>
      </div>

      {/* Receiver */}
      <div className="receipt-section">
        <h3>Receiver Information</h3>
        <p>{shipment.receiver_name || '—'}</p>
        <p>{shipment.receiver_address || '—'}</p>
        <p>{shipment.receiver_phone || '—'}</p>
        <p>{shipment.receiver_email || '—'}</p>
      </div>

      {/* Shipment details */}
      <div className="receipt-section">
        <h3>Shipment Details</h3>
        <p><strong>From:</strong> {shipment.origin}</p>
        <p><strong>To:</strong> {shipment.destination}</p>
        <p><strong>Freight type:</strong> {shipment.freight_type}</p>
        <p><strong>Weight:</strong> {shipment.weight} kg</p>
        <p><strong>Dimensions:</strong> {shipment.length} × {shipment.width} × {shipment.height} m</p>
        <p><strong>Status:</strong> {shipment.status.replace('_', ' ')}</p>
        <p><strong>Created:</strong> {new Date(shipment.created_at).toLocaleString()}</p>
      </div>
    </div>
  )
})

export default TrackReceipt