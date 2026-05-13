import { Link } from 'react-router-dom';

const BANNER_COLORS = ['olive', 'terra', 'dark', 'olive', 'terra'];

function formatDay(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return String(d.getDate()).padStart(2, '0');
}

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

export default function EventCard({ event, index = 0 }) {
  const colorClass = BANNER_COLORS[index % BANNER_COLORS.length];
  const typeLabel = event.type || event.eventType || 'Event';

  return (
    <Link to={`/events/${event._id}`} className="ev-card">
      {/* Banner */}
      <div className={`ev-card-banner ${colorClass}`}>
        <div className="ev-card-eyebrow">Convene · {typeLabel}</div>
        <div>
          <div className="ev-card-date-num">{formatDay(event.date || event.startDate)}</div>
          <div className="ev-card-month">{formatMonthYear(event.date || event.startDate)}</div>
        </div>
      </div>

      {/* Body */}
      <div className="ev-card-body">
        <div className="ev-card-title">{event.title || event.name}</div>
        <div className="ev-card-venue">{event.venue || event.location || 'Venue TBA'}</div>
      </div>

      {/* Footer */}
      <div className="ev-card-footer">
        <span className="ev-card-type">{typeLabel}</span>
        <span className="ev-card-arrow">→</span>
      </div>
    </Link>
  );
}
