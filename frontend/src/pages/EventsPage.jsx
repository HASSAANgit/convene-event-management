import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { eventsAPI } from '../api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsAPI.getAll()
      .then(res => {
        const data = res.data?.events || res.data || [];
        const approved = data.filter(e => e.status === 'approved');
        setEvents(approved);
      })
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="events-page">
      <div className="events-header">
        <span className="label-tag">Discover</span>
        <h1 className="events-title">Approved events.</h1>
      </div>

      {loading && <div className="cv-spinner" />}
      {error   && <p className="empty-state" style={{ color: 'var(--accent)' }}>{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="empty-state">No approved events yet. Check back soon.</p>
      )}

      {!loading && events.length > 0 && (
        <div className="events-grid">
          {events.map((ev, i) => (
            <EventCard key={ev._id} event={ev} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
