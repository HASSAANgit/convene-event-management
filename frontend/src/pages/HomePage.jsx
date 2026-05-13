import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PosterCard({ color, eyebrow, day, month, title, venue, rotation, top, left, zIndex }) {
  return (
    <div
      className={`poster-card ${color}`}
      style={{ transform: `rotate(${rotation}deg)`, top, left, zIndex, position: 'absolute' }}
    >
      <div>
        <div className="poster-eyebrow">{eyebrow}</div>
        <div className="poster-date-num">{day}</div>
        <div className="poster-month">{month}</div>
      </div>
      <div>
        <div className="poster-title">{title}</div>
        <div className="poster-venue">{venue}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="hero-section">
          {/* Left: text */}
          <div className="hero-content">
            <span className="hero-badge">Convene · Est. 2026</span>
            <h1 className="hero-title">
              Plan events<br />
              <span className="accent">worth</span><br />
              remembering.
            </h1>
            <p className="hero-desc">
              An event planner for the considered host. Submit, get
              reviewed, and receive an editorial-grade poster with a
              scannable QR — ready to share.
            </p>
            <div className="hero-actions">
              <Link to={user ? '/organizer' : '/login'} className="btn-primary">
                Create an event →
              </Link>
              <Link to="/events" className="btn-ghost">
                Browse approved events →
              </Link>
            </div>
          </div>

          {/* Right: floating poster cards */}
          <div className="hero-visual">
            <div className="poster-stack">
              <PosterCard
                color="olive"
                eyebrow="Convene · Concert"
                day="14"
                month="Jun 2026"
                title="Lantern Sessions vol. III"
                venue="The Arboretum"
                rotation={-4}
                top="0px"
                left="10px"
                zIndex={2}
              />
              <PosterCard
                color="terra"
                eyebrow="Convene · Wedding"
                day="02"
                month="Sep 2026"
                title="Halden & Mara"
                venue="Rosewater Hall"
                rotation={6}
                top="70px"
                left="55px"
                zIndex={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section>
        <div className="how-section">
          <div className="how-grid">
            <div>
              <div className="how-step-num">
                <span>01</span> <span>✦</span>
              </div>
              <h3 className="how-step-title">Submit</h3>
              <p className="how-step-desc">
                Fill in type, hall, persons, seats and details.
                We keep the form short.
              </p>
            </div>

            <div>
              <div className="how-step-num">
                <span>02</span> <span>🛡</span>
              </div>
              <h3 className="how-step-title">Get reviewed</h3>
              <p className="how-step-desc">
                An admin approves or rejects with a reason.
                You'll see status updates instantly.
              </p>
            </div>

            <div>
              <div className="how-step-num">
                <span>03</span> <span>◻</span>
              </div>
              <h3 className="how-step-title">Share the poster</h3>
              <p className="how-step-desc">
                Each approved event gets an elegant poster
                page and a QR code that opens it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <hr className="cv-divider" />
      <footer>
        <div className="cv-footer">
          <span className="cv-footer-copy">© 2026 Convene</span>
          <span className="cv-footer-tag">Handcrafted · Earthy · Minimal</span>
        </div>
      </footer>
    </>
  );
}
