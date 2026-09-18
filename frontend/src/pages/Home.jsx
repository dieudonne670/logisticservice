import Hero from '../components/Hero'
import ServiceCards from '../components/ServiceCards'
import TrackingWidget from '../components/TrackingWidget'
import Reviews from '../components/Reviews'

export default function Home() {
  const howWeHelp = [
    {
      image: '/images/how-we-help/anywhere-shipping.jpg',
      title: 'Anywhere Shipping',
      text: 'Our innovative service delivers small cargo to any destination worldwide.',
    },
    {
      image: '/images/how-we-help/get-insight.jpg',
      title: 'Get Insights',
      text: 'Our dedicated, professional, and highly skilled service agents are always ready to guide you.',
    },
    {
      image: '/images/how-we-help/weight-destination.jpg',
      title: 'Your Weight Destination',
      text: 'We put in all possible effort to make sure your parcel is delivered.',
    },
  ]

  return (
    <>
      <Hero />
      <ServiceCards />

      {/* How We Help You */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">How We Help You</h2>
          <p className="section-subtitle">
            Logisticservice is an innovative service and an effective logistics
            solution for the delivery of small cargo. This service is useful
            for companies in their various logistics endeavors.
          </p>
          <div className="how-we-help-grid">
            {howWeHelp.map((c) => (
              <div key={c.title} className="how-we-help-card">
                <div className="how-we-help-image">
                  <img src={c.image} alt={c.title} />
                </div>
                <h3>{c.title}</h3>
                <p className="text-muted">{c.text}</p>
                <a href="/contact" className="btn">LET'S HELP</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About block */}
      <section className="section section-gray">
        <div className="container two-col">
          <div>
            <h2>Logisticservice</h2>
            <p className="lead">Logisticservice is an innovative service</p>
            <p>
              Our trucking business is built on the idea of giving our customers
              the freedom and dependability to transfer lawful loads across
              town or across the nation anytime they choose. Our in-house staff
              of professional drivers has a wealth of expertise.
            </p>
            <p>
              We believe in offering high-quality services to our clients, and
              with decades of logistical expertise behind us, there is nothing
              we ignore while handling your goods.
            </p>
            <a href="/about" className="btn">LET'S HELP</a>
          </div>
          <img
            src="/images/about-port.png"
            alt="Cargo port"
            className="about-image"
          />
        </div>
      </section>

      {/* Tracking widget */}
      <section className="section section-gray" style={{ paddingTop: 0 }}>
        <div className="container">
          <TrackingWidget />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Why Choose Us?</h2>
            <p>
              A team of cargo specialists is always available to assist you
              with any questions you may have, or if you would like to discuss
              your logistical needs in further detail.
            </p>
            <p>
              With our nationwide network of warehouses and distribution
              facilities, it's much simpler to cater to a large audience in a
              short amount of time.
            </p>
          </div>
          <div>
            {[
              { l: 'Marketing', v: 95 },
              { l: 'Logistics', v: 85 },
              { l: 'Development', v: 90 },
              { l: '24/7 Customer Support', v: 95 },
              { l: 'Reliable Storage Facilities', v: 95 },
            ].map((p) => (
              <div key={p.l} className="progress-item">
                <div className="progress-label">
                  <span>{p.l}</span>
                  <span>{p.v}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${p.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Reviews />

      {/* Partners — Text version, no logos, no legal risk */}
      <section className="partners">
        <div className="container">
          <h3>Trusted by leading carriers worldwide</h3>
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: 16 }}>
            We coordinate shipments with major international carriers to get
            your cargo where it needs to go.
          </p>
        </div>
      </section>
    </>
  )
}
