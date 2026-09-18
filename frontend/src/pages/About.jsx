import { Link } from 'react-router-dom'

export default function About() {
  return (
    <>
      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Who we are, what we do, and why it matters</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Built for modern logistics</h2>
            <p className="lead">Moving cargo shouldn't be complicated.</p>
            <p>
              Logisticservice is a full-service freight and transportation
              company handling land, air, and sea shipments for businesses
              of every size. From a single pallet to a full container, we
              move goods from origin to destination with visibility you
              can trust.
            </p>
            <p>
              Our platform combines real-time GPS tracking, a client-facing
              tracking portal, and a live chat channel between our clients
              and our operations team. Every shipment we handle is visible,
              traceable, and backed by a team that answers when you call.
            </p>
          </div>
          <img
            src="/images/about-port.jpg"
            alt="Cargo port"
            className="about-image"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      </section>

      {/* Values */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">What We Stand For</h2>
          <p className="section-subtitle">
            Three principles guide every shipment we handle.
          </p>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">◉</div>
              <h3>Transparency</h3>
              <p>
                You see your shipment's location on a live map, in real time.
                No vague status updates. No guesswork.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">⏱</div>
              <h3>Reliability</h3>
              <p>
                We commit to a schedule and hold ourselves to it. On-time
                delivery is the baseline, not the goal.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">✉</div>
              <h3>Support</h3>
              <p>
                Live chat connects you to a real person on our team. No
                tickets, no autoresponders, no runaround.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="section">
        <div className="container two-col">
          <img
            src="/images/how-we-help/get-insights.jpg"
            alt="Logistics operations"
            className="about-image"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div>
            <h2>Global reach, local attention</h2>
            <p>
              We coordinate with partner carriers and freight forwarders
              across North America, Europe, Asia, and Africa. Whether your
              cargo is moving across a state or across an ocean, you get
              the same tracking experience and the same team behind it.
            </p>
            <p>
              For businesses shipping regularly, we provide dedicated
              account handling, custom pickup windows, and consolidated
              billing. For one-off shipments, the tracking portal and
              chat are open to everyone — no account required.
            </p>
            <Link to="/contact" className="btn">Talk to our team</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Have a shipment in mind?</h2>
          <p>Get a quote or track an existing order.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn">Request a quote</Link>
            <Link to="/track" className="btn btn-secondary">Track a shipment</Link>
          </div>
        </div>
      </section>
    </>
  )
}