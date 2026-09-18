import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import client from '../api/client'
import PublicLiveMap from '../map/PublicLiveMap'
import TrackReceipt from './TrackReceipt'
import ChatWidget from '../chat/ChatWidget'

export default function TrackShipment() {
  const [params] = useSearchParams()
  const [tn, setTn] = useState(params.get('tn') || '')
  const [shipment, setShipment] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const receiptRef = useRef(null)

  async function downloadPdf() {
    if (!receiptRef.current || !shipment) return
    setDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: 10,
          filename: `Receipt-${shipment.tracking_number}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(receiptRef.current)
        .save()
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  async function lookup(trackingNumber) {
    setError('')
    setShipment(null)
    setLoading(true)
    try {
      const { data } = await client.get(`/api/shipments/public/${trackingNumber}/`)
      setShipment(data)
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'No shipment found with that tracking number.'
          : 'Unable to load shipment. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const queryTn = params.get('tn')
    if (queryTn) lookup(queryTn)
  }, [params])

  function handleSubmit(e) {
    e.preventDefault()
    const clean = tn.trim().toUpperCase()
    if (clean) lookup(clean)
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="section-title" style={{ fontSize: 28 }}>Track Your Shipment</h1>

      <form className="tracking-widget" onSubmit={handleSubmit}>
        <h2>Enter the Consignment No.</h2>
        <div className="tracking-form">
          <input
            value={tn}
            onChange={(e) => setTn(e.target.value.toUpperCase())}
            placeholder="Enter Tracking Number"
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'SEARCHING...' : 'TRACK RESULT'}
          </button>
        </div>
        <div className="tracking-hint">Ex: CEL012392196443-CARGO</div>
      </form>

      {error && (
        <div className="card mt-4" style={{ color: 'var(--orange)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {shipment && (
        <>
          {/* 1. Tracking result summary */}
          <div className="card mt-4">
            <div className="flex-between">
              <span className="tracking-badge">{shipment.tracking_number}</span>
              <span className={`status-pill status-${shipment.status}`}>
                {shipment.status.replace('_', ' ')}
              </span>
            </div>
            <div
              className="mt-4"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
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
                <div className="text-muted" style={{ fontSize: 12 }}>Freight</div>
                <div style={{ textTransform: 'capitalize' }}>{shipment.freight_type}</div>
              </div>
            </div>
          </div>

          {/* 2. Receipt preview (smaller) */}
          <div className="receipt-wrap">
            <TrackReceipt ref={receiptRef} shipment={shipment} />
          </div>

          {/* 3. Download button under the receipt */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button className="btn btn-outline" onClick={downloadPdf} disabled={downloading}>
              {downloading ? '⏳ Generating PDF...' : '⬇ Download Receipt (PDF)'}
            </button>
          </div>

          {/* 4. Scroll hint + live map at the bottom */}
          <div className="scroll-hint">
            <span>Scroll down for live tracking</span>
            <span className="scroll-hint-arrow">↓</span>
          </div>

          <div className="card mt-4">
            <h2 className="card-title">Live Location</h2>
            <PublicLiveMap shipmentId={shipment.id} />
          </div>

          <ChatWidget shipmentId={shipment.id} tracking={shipment.tracking_number} />
        </>
      )}
    </div>
  )
}