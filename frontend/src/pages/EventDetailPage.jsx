import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { eventsAPI, bookingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime, formatCurrency, timeUntilEvent, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import EventBannerModal from '../components/EventBannerModal';
import toast from 'react-hot-toast';
import { HiCalendar, HiLocationMarker, HiTicket, HiCurrencyDollar, HiUser, HiTag, HiArrowLeft, HiClock, HiPhotograph } from 'react-icons/hi';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    eventsAPI.getOne(id)
      .then((res) => setEvent(res.data.event))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('seatUpdate', (data) => {
      if (data.eventId === id) {
        setEvent((prev) => prev ? { ...prev, availableTickets: data.availableTickets } : prev);
      }
    });

    return () => { socket.disconnect(); };
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      return navigate('/login');
    }
    try {
      setBooking(true);
      await bookingsAPI.create({ eventId: id, tickets });
      toast.success(`🎉 ${tickets} ticket(s) booked successfully!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="dash-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div className="cv-spinner" /></div>;
  if (!event) return <div className="dash-page" style={{ textAlign: 'center', paddingTop: '120px' }}><p style={{ color: 'var(--text-muted)' }}>Event not found</p></div>;

  const isSoldOut = event.availableTickets === 0;
  const totalCost = event.price * tickets;

  return (
    <div style={{ paddingBottom: '64px' }}>
      <EventBannerModal event={event} isOpen={showBanner} onClose={() => setShowBanner(false)} />

      {/* Hero banner */}
      <div className="relative" style={{ height: '320px', overflow: 'hidden' }}>
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--olive)' }}>
            <span style={{ fontSize: '8rem', opacity: 0.3 }}>{CATEGORY_ICONS[event.category]}</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg) 0%, rgba(232,228,220,0.4) 50%, transparent 100%)' }} />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <HiArrowLeft /> Back
          </button>
        </div>

        {/* Category & Banner button */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button onClick={() => setShowBanner(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            <HiPhotograph className="text-lg" /> Get Banner & QR
          </button>
          <span className="px-3 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--olive)' }}>
            {CATEGORY_ICONS[event.category]} {event.category}
          </span>
        </div>
      </div>

      <div className="page-container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="card p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--text)', marginBottom: '8px' }}>{event.title}</h1>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <HiUser style={{ color: 'var(--accent)' }} />
                    <span>Organized by <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{event.organizer?.name}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.8rem', color: 'var(--accent)' }}>{formatCurrency(event.price)}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>per ticket</p>
                </div>
              </div>

              <hr className="cv-divider" style={{ marginBottom: '24px' }} />

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <HiCalendar style={{ color: 'var(--accent)' }} />, label: 'Date', value: formatDate(event.date), sub: formatTime(event.date) },
                  { icon: <HiClock style={{ color: 'var(--olive)' }} />, label: 'Countdown', value: timeUntilEvent(event.date) },
                  { icon: <HiLocationMarker style={{ color: 'var(--olive)' }} />, label: 'Location', value: event.location, sub: event.venue },
                  { icon: <HiTicket style={{ color: 'var(--accent)' }} />, label: 'Availability', value: isSoldOut ? '😢 Sold Out' : `${event.availableTickets} / ${event.totalTickets} left` },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <div className="text-xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.label}</p>
                      <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</p>
                      {item.sub && <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '12px' }}>About this Event</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{event.description}</p>

              {/* Tags */}
              {event.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                      style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <HiTag style={{ color: 'var(--accent)' }} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Booking sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-1">
            <div className="card p-6" style={{ position: 'sticky', top: '80px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '24px' }}>
                {isSoldOut ? '😢 Sold Out' : '🎟️ Book Tickets'}
              </h3>

              {!isSoldOut && event.status === 'approved' && (
                <div className="space-y-4">
                  <div>
                    <label className="cv-label">Number of Tickets</label>
                    <input
                      type="number"
                      min={1}
                      max={Math.min(10, event.availableTickets)}
                      value={tickets}
                      onChange={(e) => setTickets(Math.max(1, Math.min(10, Number(e.target.value))))}
                      className="cv-input"
                    />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>Max 10 per booking</p>
                  </div>

                  {event.price > 0 && (
                    <div className="p-4 rounded-lg" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <div className="flex justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span>${event.price} × {tickets}</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                      <hr className="cv-divider" style={{ margin: '8px 0' }} />
                      <div className="flex justify-between" style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--text)' }}>Total</span>
                        <span style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>{formatCurrency(totalCost)}</span>
                      </div>
                    </div>
                  )}

                  {event.price === 0 && (
                    <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(74,95,58,0.08)', border: '1px solid rgba(74,95,58,0.15)' }}>
                      <p style={{ color: 'var(--olive)', fontWeight: 600 }}>🎉 This event is FREE!</p>
                    </div>
                  )}

                  <button onClick={handleBook} disabled={booking || !user} className="btn-primary w-full" style={{ padding: '14px', fontSize: '1rem' }}>
                    {booking ? (
                      <div className="cv-spinner" style={{ width: '20px', height: '20px', margin: '0 auto' }} />
                    ) : user ? 'Book Now →' : 'Login to Book'}
                  </button>

                  {!user && (
                    <Link to="/login" className="block text-center text-sm" style={{ color: 'var(--accent)' }}>
                      Sign in to continue →
                    </Link>
                  )}
                </div>
              )}

              {isSoldOut && (
                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(100,30,30,0.06)', border: '1px solid rgba(100,30,30,0.12)' }}>
                  <p style={{ color: '#7a2020', fontSize: '0.9rem' }}>All tickets have been sold.</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>Check back later for cancellations.</p>
                </div>
              )}

              {/* Event info summary */}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Category</span>
                  <span style={{ color: 'var(--text)' }}>{CATEGORY_ICONS[event.category]} {event.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Status</span>
                  <span className={`status-badge status-${event.status}`}>{event.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Total Capacity</span>
                  <span style={{ color: 'var(--text)' }}>{event.totalTickets} tickets</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
