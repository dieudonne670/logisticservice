import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <div>✉ info@logisticservice.com</div>
          <div>✉ contact@logisticservice.com</div>
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
  <img src="/logo.png" alt="Logisticservice" style={{ height: 80 }} />
</Link>
          <div className="navbar-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/services">Our Services</NavLink>
            <NavLink to="/track">Track Package</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
          </div>
          <Link to="/track" className="btn-track">
            📍 TRACK PACKAGE
          </Link>
        </div>
      </nav>
    </>
  )
}