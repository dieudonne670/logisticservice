import { useState } from 'react'
import ChatPanel from './ChatPanel'

export default function ChatWidget({ shipmentId, tracking }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 360,
            zIndex: 500,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <ChatPanel shipmentId={shipmentId} tracking={tracking} height={420} />
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#f26522',
          color: 'white',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(242, 101, 34, 0.4)',
          zIndex: 501,
        }}
        aria-label="Toggle chat"
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  )
}