import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })
  const [sent, setSent] = useState(false)

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // For now, just show a success message.
    // We'll wire this to a real backend endpoint in deployment.
    setSent(true)
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We respond to every message within one business day</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          {/* Left column: info */}
          <div>
            <h2>Get in touch</h2>
            <p className="lead">Questions about a shipment, pricing, or partnerships?</p>
            <p>
              Reach out through the form, by email, or by phone. If you
              have a live shipment in progress, the fastest way is to open
              the chat on your tracking page — a member of our team will
              respond in real time.
            </p>

            <div className="contact-info">
              <div className="contact-row">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Office</strong>
                  <p>1900 W Anaheim St<br />Long Beach, CA 90813</p>
                </div>
              </div>
              <div className="contact-row">
                <span className="contact-icon">✉</span>
                <div>
                  <strong>Email</strong>
                  <p>logisticsservice04@gmail.com<br />contact@logisticservice.com</p>
                </div>
              </div>
              <div className="contact-row">
                <span className="contact-icon">☎</span>
                <div>
                  <strong>Phone</strong>
                  <p>+1 (202) 681-3858</p>
                </div>
              </div>
              <div className="contact-row">
                <span className="contact-icon">⏱</span>
                <div>
                  <strong>Hours</strong>
                  <p>Monday – Friday, 8:00 – 18:00<br />24/7 for active shipments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: form */}
          <div className="card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ marginBottom: 12 }}>Message received</h3>
                <p className="text-muted">
                  Thank you for reaching out. A member of our team will
                  respond to {form.email} within one business day.
                </p>
                <button
                  className="btn btn-secondary mt-4"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', email: '', phone: '', subject: 'general', message: '' })
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="card-title">Send us a message</h3>

                <div className="form-group">
                  <label className="form-label">Your name</label>
                  <input className="form-input" value={form.name} onChange={update('name')} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={update('email')} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone (optional)</label>
                  <input className="form-input" value={form.phone} onChange={update('phone')} />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={update('subject')}>
                    <option value="general">General inquiry</option>
                    <option value="quote">Request a quote</option>
                    <option value="shipment">About an existing shipment</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input"
                    rows="5"
                    value={form.message}
                    onChange={update('message')}
                    required
                  />
                </div>

                <button className="btn" type="submit">Send message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}