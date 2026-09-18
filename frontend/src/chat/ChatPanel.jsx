import { useEffect, useRef, useState } from 'react'

export default function ChatPanel({ shipmentId, tracking, token, height = 420 }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const wsRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!shipmentId) return
     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const host = window.location.host
let url = `${protocol}//${host}/ws/chat/shipment_${shipmentId}/`
if (token) url += `?token=${token}`
else if (tracking) url += `?tracking=${tracking}`
    if (token) {
      url += `?token=${token}`
    } else if (tracking) {
      url += `?tracking=${tracking}`
    }

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => {
      setError('Connection error')
      setConnected(false)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'history') {
        setMessages(data.messages)
      } else if (data.type === 'message') {
        setMessages((prev) => [...prev, data])
      }
    }

    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [shipmentId, tracking, token])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function send(e) {
    e.preventDefault()
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== 1) return
    wsRef.current.send(JSON.stringify({ message: input.trim() }))
    setInput('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height, border: '1px solid #e5e7eb', borderRadius: 4, background: 'white' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
        <strong>Chat with us</strong>
        <span style={{ color: connected ? '#16a34a' : '#94a3b8', fontSize: 12 }}>
          {connected ? '● Connected' : '○ Disconnected'}
        </span>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 14, background: '#f9fafb' }}>
        {messages.length === 0 && (
          <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
            No messages yet. Ask us about your shipment.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: m.from_admin ? 'flex-start' : 'flex-end',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                background: m.from_admin ? 'white' : '#1a1d3a',
                color: m.from_admin ? '#1a1a1a' : 'white',
                padding: '8px 12px',
                borderRadius: 12,
                fontSize: 14,
                border: m.from_admin ? '1px solid #e5e7eb' : 'none',
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{m.sender_label}</div>
              <div>{m.message}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: '6px 14px', color: '#ef4444', fontSize: 12 }}>{error}</div>}

      <form onSubmit={send} style={{ display: 'flex', borderTop: '1px solid #e5e7eb' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, border: 'none', padding: '12px 14px', fontSize: 14, outline: 'none' }}
        />
        <button
          type="submit"
          style={{ background: '#f26522', color: 'white', border: 'none', padding: '0 20px', fontWeight: 600, cursor: 'pointer' }}
        >
          Send
        </button>
      </form>
    </div>
  )
}
