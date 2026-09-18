import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function PublicLiveMap({ shipmentId }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const wsRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    mapRef.current = L.map(containerRef.current).setView([39.8283, -98.5795], 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!shipmentId) return
    const url = `ws://127.0.0.1:8000/ws/tracking/${shipmentId}/`
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.latitude == null || data.longitude == null) return
      const lat = parseFloat(data.latitude)
      const lng = parseFloat(data.longitude)
      setLastUpdate({ lat, lng, timestamp: data.timestamp })

      if (mapRef.current) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current)
        }
        mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 10))
      }
    }

    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [shipmentId])

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <span className={`status-pill ${connected ? 'status-delivered' : 'status-pending'}`}>
          {connected ? '● Live tracking' : '○ Connecting...'}
        </span>
        {lastUpdate && (
          <span className="text-muted" style={{ fontSize: 13 }}>
            Updated {new Date(lastUpdate.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        style={{
          height: 500,
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      />
    </div>
  )
}