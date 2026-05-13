import { useState, useEffect } from 'react';
import axios from 'axios';

const FALLBACK = [
  {
    _id: '1',
    quote: 'Convene made our wedding night seamless. The poster was stunning and guests loved the QR code at the entrance.',
    author: 'Mara & Halden',
    role: 'Wedding · Rosewater Hall',
  },
  {
    _id: '2',
    quote: 'We submitted the Lantern Sessions event and had approval within a day. The editorial design is exactly our aesthetic.',
    author: 'Soren T.',
    role: 'Concert Organiser · The Arboretum',
  },
  {
    _id: '3',
    quote: 'Finally a platform that treats events as art. Clean, minimal, and fast — everything we needed.',
    author: 'Priya A.',
    role: 'Corporate Host · Meridian Centre',
  },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    axios.get(`${base}/testimonials`)
      .then(res => {
        const data = res.data?.testimonials || res.data || [];
        setTestimonials(data.length ? data : FALLBACK);
      })
      .catch(() => setTestimonials(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="testimonials-page">
      {/* Header */}
      <div className="section-header">
        <span className="label-tag">Voices</span>
        <h1 className="section-title">What hosts say.</h1>
      </div>

      {loading && <div className="cv-spinner" />}

      {!loading && (
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={t._id || i} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote || t.content || t.text}"</p>
              <div>
                <div className="testimonial-author">{t.author || t.name}</div>
                <div className="testimonial-role">{t.role || t.eventType || ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <hr className="cv-divider" style={{ marginTop: '80px' }} />
      <footer>
        <div className="cv-footer">
          <span className="cv-footer-copy">© 2026 Convene</span>
          <span className="cv-footer-tag">Handcrafted · Earthy · Minimal</span>
        </div>
      </footer>
    </div>
  );
}
