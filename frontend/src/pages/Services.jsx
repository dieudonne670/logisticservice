import { Link } from 'react-router-dom'

export default function Services() {
  const services = [
    {
      id: 'land',
      icon: '/images/services/forwarding.png',
      title: 'Land Freight',
      tagline: 'Trucking that arrives when we say it will.',
      description:
        'Full truckload and less-than-truckload service across regional and national routes. Our vetted carrier network handles everything from single pallets to full trailers, with live GPS on every load.',
      features: [
        'Full Truckload (FTL) and Less-than-Truckload (LTL)',
        'Real-time GPS tracking on every shipment',
        'Temperature-controlled options available',
        'Dedicated and shared carrier options',
      ],
    },
    {
      id: 'air',
      icon: 'images/services/air-freight.png',
      title: 'Air Freight',
      tagline: 'When time matters most.',
      description:
        'Priority air freight to major hubs worldwide, with consolidated and expedited options. Ideal for high-value, time-sensitive, or perishable cargo where every hour counts.',
      features: [
        'Express and consolidated air service',
        'Door-to-door or airport-to-airport',
        'Customs coordination and documentation',
        'Coverage across most countries worldwide',
      ],
    },
    {
      id: 'sea',
      icon: '/images/services/sea-freight.png',
      title: 'Sea Freight',
      tagline: 'Cost-effective for volume and weight.',
      description:
        'Full container load (FCL) and less-than-container load (LCL) ocean freight with weekly sailings to major ports. The most economical option for bulk cargo and heavy shipments.',
      features: [
        'FCL and LCL ocean freight',
        'Weekly sailings to major ports',
        'Port-to-port or door-to-door',
        'Full customs and documentation support',
      ],
    },
    {
      id: 'insurance',
      icon: '/images/services/insurance.png',
      title: 'Insurance & Warehousing',
      tagline: 'Coverage and storage you can rely on.',
      description:
        'Cargo insurance for the full value of your shipment, plus secure short- and long-term warehousing at our facilities. Storage, cross-docking, and inventory management available.',
      features: [
        'Full-value cargo insurance',
        'Secure short- and long-term storage',
        'Cross-docking and transloading',
        'Inventory management on request',
      ],
    },
  ]

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Land, air, sea, and everything in between</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="section-subtitle" style={{ marginBottom: 60 }}>
            Every service includes live tracking, a dedicated point of contact,
            and access to our client chat channel.
          </p>

          {services.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className="service-detail"
              style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}
            >
              <div className="service-detail-icon">
                <img
                  src={s.icon}
                  alt={s.title}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              <div className="service-detail-body">
                <h2>{s.title}</h2>
                <p className="lead">{s.tagline}</p>
                <p>{s.description}</p>
                <ul className="feature-list">
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Not sure which service fits?</h2>
          <p>Tell us what you're shipping and we'll recommend the right option.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn">Get a recommendation</Link>
            <Link to="/track" className="btn btn-secondary">Track a shipment</Link>
          </div>
        </div>
      </section>
    </>
  )
}