import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TrackingWidget({ light = false }) {
  const [tn, setTn] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (tn.trim()) navigate(`/track?tn=${tn.trim().toUpperCase()}`)
  }

  return (
    <div className="tracking-widget" style={light ? { background: 'white' } : undefined}>
      <h2>Enter the Consignment No.</h2>
      <form className="tracking-form" onSubmit={handleSubmit}>
        <input
          value={tn}
          onChange={(e) => setTn(e.target.value.toUpperCase())}
          placeholder="Enter Tracking Number"
        />
        <button className="btn" type="submit">TRACK RESULT</button>
      </form>
      <div className="tracking-hint">Ex: TRK12345ABC</div>
    </div>
  )
}