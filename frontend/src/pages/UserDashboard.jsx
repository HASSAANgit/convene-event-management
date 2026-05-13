import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../api';
import { formatDate, formatCurrency } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiTicket, HiCalendar, HiLocationMarker, HiX, HiSearch } from 'react-icons/hi';
import { MdEventNote } from 'react-icons/md';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getMyBookings();
      setBookings(res.data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      setCancelling(id);
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    } finally {
      setCancelling(null);
    }
  };

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    spent:     bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.totalAmount, 0),
  };

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  const statCards = [
    { icon: '🎟️', label: 'Total Bookings', value: stats.total },
    { icon: '✅', label: 'Confirmed',      value: stats.confirmed },
    { icon: '❌', label: 'Cancelled',      value: stats.cancelled },
    { icon: '💰', label: 'Total Spent',    value: formatCurrency(stats.spent) },
  ];

  return (
    <div className="dash-page">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          style={{ background: 'var(--accent)' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <span className="label-tag">My Events</span>
          <h1 className="section-title">Hey, {user?.name?.split(' ')[0]}! 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your bookings and explore events</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="card p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.6rem', color: 'var(--text)' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="card p-6 mb-6">
        <h3 className="dash-sidebar-title" style={{ marginBottom: '16px' }}>Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/events" className="btn-primary text-sm flex items-center gap-2">
            <HiSearch /> Discover Events
          </Link>
          <Link to="/events" className="btn-ghost text-sm flex items-center gap-2">
            <MdEventNote /> Browse All
          </Link>
        </div>
      </div>

      {/* Bookings */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="dash-sidebar-title" style={{ marginBottom: 0 }}>My Bookings</h3>
          <div className="flex gap-2">
            {['all', 'confirmed', 'cancelled'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`btn-outline ${activeTab === tab ? 'active-tab' : ''}`}
                style={{ padding: '5px 14px', fontSize: '0.78rem', textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="cv-spinner" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-3" style={{ opacity: 0.4 }}>🎭</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No bookings yet</p>
            <Link to="/events" className="btn-primary text-sm">Find Events</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking, i) => (
                <motion.div key={booking._id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                
                {/* Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: 'var(--bg-card)' }}>
                  {booking.event?.image
                    ? <img src={booking.event.image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🎉</div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }} className="truncate">{booking.event?.title || 'Event'}</h4>
                    <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {booking.event?.date && <span className="flex items-center gap-1"><HiCalendar style={{ color: 'var(--accent)' }} /> {formatDate(booking.event.date)}</span>}
                    {booking.event?.location && <span className="flex items-center gap-1"><HiLocationMarker style={{ color: 'var(--olive)' }} /> {booking.event.location}</span>}
                    <span className="flex items-center gap-1"><HiTicket style={{ color: 'var(--accent)' }} /> {booking.tickets} ticket(s)</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', fontFamily: 'monospace' }}>Ref: {booking.bookingReference}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p style={{ fontWeight: 600, color: 'var(--text)' }}>{formatCurrency(booking.totalAmount)}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{booking.paymentStatus}</p>
                  </div>
                  {booking.status === 'confirmed' && (
                    <button onClick={() => handleCancel(booking._id)} disabled={cancelling === booking._id}
                      className="btn-outline p-2" style={{ borderColor: 'rgba(100,30,30,0.2)', color: '#7a2020' }}>
                      {cancelling === booking._id
                        ? <div className="cv-spinner" style={{ width: '16px', height: '16px', margin: 0 }} />
                        : <HiX />
                      }
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
