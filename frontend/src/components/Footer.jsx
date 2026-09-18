import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>Logisticservice</h4>
            <p style={{ marginBottom: 20 }}>
              We provide a wide range of logistics management and supply chain
              solutions. From domestic retail distribution to worldwide
              transportation delivery, we offer a comprehensive variety of
              transportation services.
            </p>
            <Link to="/contact" className="btn">✉ CONTACT US NOW</Link>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/track">Track Package</Link>
            <Link to="/login" style={{ opacity: 0.4, fontSize: 12, marginTop: 16 }}>Admin Login</Link>
          </div>
          <div>
            <h4>Services</h4>
            <Link to="/services#land">Land Freight</Link>
            <Link to="/services#air">Air Freight</Link>
            <Link to="/services#sea">Sea Freight</Link>
            <Link to="/services#insurance">Insurance</Link>
            <Link to="/services#warehousing">Warehousing</Link>
          </div>
          <div>
            <h4>Know More</h4>
            <div className="footer-contact">📍 1900 W Anaheim St, Long Beach, CA 90813</div>
            <div className="footer-contact">✉ logisticsservice04@gmail.com</div>
            <div className="footer-contact">✉ contact@logisticservice.com</div>
          </div>
        </div>
        <div className="footer-bottom">
          Copyright © 2026 Logisticservice. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}