export default function ServiceCards() {
  const services = [
    {
      icon: 'images/services/sea-freight.jpg',
      title: 'Sea Freight',
      text: 'Shipments of goods come in from factories or warehouses and go to shops, restaurants, or hospitals.',
    },
    {
      icon: '/images/services/air-freight.png',
      title: 'Air Freight',
      text: 'With a coverage area in most countries of the world, we are sure to get your parcel anywhere you want.',
    },
    {
      icon: '/images/services/insurance.png',
      title: 'Insurance',
      text: 'Our warehouse logistics facilities ensure the best possible storage, insurance, and management of your goods.',
    },
    {
      icon: '/images/services/forwarding.png',
      title: 'Forwarding',
      text: 'We are a worldwide delivery service and experts in eCommerce and logistics across the world.',
    },
  ]

  return (
    <section className="services-band">
      <div className="container">
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.title} className="service-card">
              <img
                src={s.icon}
                alt={s.title}
                className="service-icon"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}