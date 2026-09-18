import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function PublicLiveMap({ shipmentId }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const wsRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Utility: place or move the marker
  function placeMarker(lat, lng, { zoom = true } = {}) {
    if (!mapRef.current) return
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current)
    }
    if (zoom) {
      mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 10))
    }
  }

  // 1. Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    mapRef.current = L.map(containerRef.current).setView([39.8283, -98.5795], 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
  detectRetina: true,
  // Force no localization
  subdomains: 'abc',
}).addTo(mapRef.current)
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // 2. On mount, load the last known location via REST so we don't start empty
  useEffect(() => {
    if (!shipmentId) return

    let cancelled = false
    fetch(`${API_BASE}/api/locations/latest/${shipmentId}/`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.latitude != null && data.longitude != null) {
          const lat = parseFloat(data.latitude)
          const lng = parseFloat(data.longitude)
          setLastUpdate({ lat, lng, timestamp: data.timestamp })
          placeMarker(lat, lng)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [shipmentId])

  // 3. Open the WebSocket for live updates
  useEffect(() => {
    if (!shipmentId) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host  // includes domain and port
    const url = `${protocol}//${host}/ws/tracking/${shipmentId}/`
    console.log('[PublicLiveMap] connecting to', url)

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[PublicLiveMap] connected')
      setConnected(true)
    }
    ws.onclose = () => {
      console.log('[PublicLiveMap] closed')
      setConnected(false)
    }
    ws.onerror = (e) => {
      console.log('[PublicLiveMap] error', e)
      setConnected(false)
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('[PublicLiveMap] message', data)
      if (data.latitude == null || data.longitude == null) return
      const lat = parseFloat(data.latitude)
      const lng = parseFloat(data.longitude)
      setLastUpdate({ lat, lng, timestamp: data.timestamp })
      placeMarker(lat, lng)
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
            {lastUpdate.lat.toFixed(4)}, {lastUpdate.lng.toFixed(4)} —{' '}
            {new Date(lastUpdate.timestamp).toLocaleTimeString()}
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
