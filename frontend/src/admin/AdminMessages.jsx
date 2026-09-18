import { useEffect, useState } from 'react'
import client from '../api/client'
import ChatPanel from '../chat/ChatPanel'

export default function AdminMessages() {
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('access_token')

  useEffect(() => {
    client
      .get('/api/chat/conversations/')
      .then((res) => {
        setConversations(res.data)
        if (res.data.length > 0) setSelected(res.data[0])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading conversations...</div>

  if (conversations.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Messages</h2>
        <p className="text-muted">
          No conversations yet. Clients who open the chat on their tracking page will appear here.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, minHeight: 'calc(100vh - 160px)' }}>
      {/* Conversation list */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#1a1d3a' }}>
          Conversations
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((c) => (
            <div
              key={c.shipment_id}
              onClick={() => setSelected(c)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                background: selected?.shipment_id === c.shipment_id ? '#f1f5f9' : 'white',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1d3a' }}>
                {c.tracking_number}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {c.origin} → {c.destination}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.last_from_admin ? 'You: ' : ''}{c.last_message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div>
        {selected ? (
          <>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="flex-between">
                <div>
                  <span className="tracking-badge">{selected.tracking_number}</span>
                  <span style={{ marginLeft: 12, fontSize: 13, color: '#64748b' }}>
                    {selected.origin} → {selected.destination}
                  </span>
                </div>
              </div>
            </div>
            <ChatPanel
              key={selected.shipment_id}
              shipmentId={selected.shipment_id}
              token={token}
              height={520}
            />
          </>
        ) : (
          <div className="card">Select a conversation</div>
        )}
      </div>
    </div>
  )
}