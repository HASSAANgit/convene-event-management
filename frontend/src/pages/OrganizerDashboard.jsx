import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency, STATUS_CONFIG, CATEGORIES, CATEGORY_ICONS } from '../utils/constants';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiEye, HiX, HiUpload } from 'react-icons/hi';

function EventFormModal({ open, onClose, onSaved, editEvent }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(editEvent?.image || '');

  useEffect(() => {
    if (editEvent) {
      reset({
        title: editEvent.title,
        description: editEvent.description,
        category: editEvent.category,
        date: editEvent.date?.split('T')[0],
        location: editEvent.location,
        venue: editEvent.venue,
        price: editEvent.price,
        totalTickets: editEvent.totalTickets,
        tags: editEvent.tags?.join(', '),
      });
      setPreview(editEvent.image || '');
    } else {
      reset({});
      setPreview('');
    }
  }, [editEvent, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'image' && v?.[0]) fd.append('image', v[0]);
        else if (v !== undefined && v !== '') fd.append(k, v);
      });

      if (editEvent) {
        await eventsAPI.update(editEvent._id, fd);
        toast.success('Event updated!');
      } else {
        await eventsAPI.create(fd);
        toast.success('Event created! Awaiting admin approval.');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,18,9,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.3rem', color: 'var(--text)' }}>
            {editEvent ? '✏️ Edit Event' : '➕ Create New Event'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="input-label">Event Title *</label>
              <input type="text" className="input-field" placeholder="Amazing Tech Conference 2025" {...register('title', { required: 'Title required' })} />
              {errors.title && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.title.message}</p>}
            </div>

            <div>
              <label className="input-label">Category *</label>
              <select className="input-field" {...register('category', { required: 'Category required' })}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
              {errors.category && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.category.message}</p>}
            </div>

            <div>
              <label className="input-label">Date *</label>
              <input type="date" className="input-field" {...register('date', { required: 'Date required' })} />
              {errors.date && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.date.message}</p>}
            </div>

            <div>
              <label className="input-label">Location / City *</label>
              <input type="text" className="input-field" placeholder="New York, NY" {...register('location', { required: 'Location required' })} />
              {errors.location && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.location.message}</p>}
            </div>

            <div>
              <label className="input-label">Venue Name</label>
              <input type="text" className="input-field" placeholder="Madison Square Garden" {...register('venue')} />
            </div>

            <div>
              <label className="input-label">Price ($) *</label>
              <input type="number" min="0" step="0.01" className="input-field" placeholder="0 for free events" {...register('price', { required: 'Price required', min: 0 })} />
              {errors.price && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.price.message}</p>}
            </div>

            <div>
              <label className="input-label">Total Tickets *</label>
              <input type="number" min="1" className="input-field" placeholder="100" {...register('totalTickets', { required: 'Total tickets required', min: 1 })} />
              {errors.totalTickets && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.totalTickets.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="input-label">Description *</label>
              <textarea rows={4} className="input-field" style={{ resize: 'none' }} placeholder="Tell people about your event..." {...register('description', { required: 'Description required' })} />
              {errors.description && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.description.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="input-label">Tags (comma-separated)</label>
              <input type="text" className="input-field" placeholder="networking, tech, innovation" {...register('tags')} />
            </div>

            <div className="sm:col-span-2">
              <label className="input-label">Event Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all"
                style={{ borderColor: 'var(--border-strong)' }}>
                {preview ? (
                  <img src={preview} alt="preview" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <HiUpload className="mx-auto text-3xl mb-2" style={{ color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click to upload image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('image')}
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setPreview(URL.createObjectURL(f));
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <div className="cv-spinner" style={{ width: '20px', height: '20px', margin: 0 }} /> : (editEvent ? 'Save Changes' : 'Create Event')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [attendeesModal, setAttendeesModal] = useState(null);
  const [attendees, setAttendees] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await eventsAPI.getMyEvents();
      setEvents(res.data.events);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event and all its bookings?')) return;
    try {
      await eventsAPI.delete(id);
      toast.success('Event deleted');
      fetchEvents();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleViewAttendees = async (id) => {
    try {
      const res = await eventsAPI.getAttendees(id);
      setAttendees(res.data.bookings);
      setAttendeesModal(id);
    } catch {
      toast.error('Failed to load attendees');
    }
  };

  const stats = {
    total: events.length,
    approved: events.filter((e) => e.status === 'approved').length,
    pending: events.filter((e) => e.status === 'pending').length,
    tickets: events.reduce((s, e) => s + (e.totalTickets - e.availableTickets), 0),
  };

  return (
    <div className="dash-page">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <span className="label-tag">Host</span>
          <h1 className="section-title">Organizer Dashboard 🎪</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your events and track performance</p>
        </div>
        <button
          onClick={() => { setEditEvent(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <HiPlus /> Create Event
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '🎉', label: 'Total Events', value: stats.total },
          { icon: '✅', label: 'Approved', value: stats.approved },
          { icon: '⏳', label: 'Pending', value: stats.pending },
          { icon: '🎟️', label: 'Tickets Sold', value: stats.tickets },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.6rem', color: 'var(--text)' }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Events table */}
      <div className="card p-6">
        <h3 className="dash-sidebar-title" style={{ marginBottom: '24px' }}>My Events</h3>

        {loading ? (
          <div className="cv-spinner" />
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🎭</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No events yet. Create your first one!</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary">Create Event</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Tickets</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ background: 'var(--bg)' }}>
                          {event.image ? <img src={event.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">{CATEGORY_ICONS[event.category]}</div>}
                        </div>
                        <div>
                          <p style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.88rem' }} className="line-clamp-1">{event.title}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{event.location}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{formatDate(event.date)}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(event.price)}</td>
                    <td>
                      <div style={{ fontSize: '0.88rem' }}>
                        <span style={{ color: 'var(--text)' }}>{event.totalTickets - event.availableTickets}</span>
                        <span style={{ color: 'var(--text-muted)' }}> / {event.totalTickets}</span>
                      </div>
                    </td>
                    <td><span className={`status-badge status-${event.status}`}>{event.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewAttendees(event._id)} className="p-1.5 rounded-lg transition-colors" title="View Attendees"
                          style={{ color: 'var(--olive)' }}>
                          <HiEye />
                        </button>
                        <button onClick={() => { setEditEvent(event); setModalOpen(true); }} className="p-1.5 rounded-lg transition-colors" title="Edit"
                          style={{ color: 'var(--text-muted)' }}>
                          <HiPencil />
                        </button>
                        <button onClick={() => handleDelete(event._id)} className="p-1.5 rounded-lg transition-colors" title="Delete"
                          style={{ color: '#7a2020' }}>
                          <HiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event form modal */}
      <AnimatePresence>
        {modalOpen && (
          <EventFormModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditEvent(null); }}
            onSaved={fetchEvents}
            editEvent={editEvent}
          />
        )}
      </AnimatePresence>

      {/* Attendees modal */}
      <AnimatePresence>
        {attendeesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,18,9,0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.2rem', color: 'var(--text)' }}>👥 Attendees ({attendees.length})</h3>
                <button onClick={() => setAttendeesModal(null)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}><HiX /></button>
              </div>
              {attendees.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No bookings yet</p>
              ) : (
                <table className="cv-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Tickets</th><th>Status</th></tr></thead>
                  <tbody>
                    {attendees.map((b) => (
                      <tr key={b._id}>
                        <td>{b.user?.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{b.user?.email}</td>
                        <td>{b.tickets}</td>
                        <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
