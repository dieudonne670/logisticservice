import { useEffect, useState } from 'react'
import { reviews } from '../data/reviews'

function Stars({ count }) {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= count ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

function Avatar({ name, src }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className="review-avatar initials">{initials}</div>
  }
  return (
    <img
      className="review-avatar"
      src={src}
      alt={name}
      onError={() => setFailed(true)}
    />
  )
}

export default function Reviews() {
  const [index, setIndex] = useState(0)
  const current = reviews[index]

  // Auto-advance every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  function prev() {
    setIndex((i) => (i - 1 + reviews.length) % reviews.length)
  }

  function next() {
    setIndex((i) => (i + 1) % reviews.length)
  }

  return (
    <section className="reviews">
      <div className="container">
        <div className="reviews-header">
          <p className="reviews-eyebrow">Happy Customer Quotes</p>
          <h2 className="reviews-title">Our Top Reviews</h2>
        </div>

        <div className="review-card">
          <button className="review-arrow left" onClick={prev} aria-label="Previous review">
            ‹
          </button>

          <div className="review-body">
            <Stars count={current.rating} />
            <p className="review-text">{current.text}</p>
            <div className="review-author">
              <Avatar name={current.name} src={current.avatar} />
              <div>
                <div className="review-name">{current.name}</div>
                <div className="review-location">{current.location}</div>
              </div>
            </div>
          </div>

          <button className="review-arrow right" onClick={next} aria-label="Next review">
            ›
          </button>
        </div>

        <div className="review-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`review-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}