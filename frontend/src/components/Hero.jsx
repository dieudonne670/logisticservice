import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>Discover Logistics Now,<br />Huge Transport Holding</h1>
        <p>We are the best company for cargo and transportation</p>
        <Link to="/track" className="btn">TRACK YOUR SHIPMENT</Link>
      </div>
    </section>
  )
}
