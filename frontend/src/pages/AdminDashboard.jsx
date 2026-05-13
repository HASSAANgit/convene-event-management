import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI, bookingsAPI, eventsAPI } from '../api';
import { formatDate, formatCurrency, STATUS_CONFIG, CATEGORIES, CATEGORY_ICONS } from '../utils/constants';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiUsers, HiCalendar, HiTicket, HiCurrencyDollar,
  HiCheck, HiX, HiTrash, HiShieldCheck, HiClock,
  HiUpload, HiPencil, HiPlus
} from 'react-icons/hi';
import { MdEventNote, MdAdminPanelSettings } from 'react-icons/md';

const tabs = ['overview', 'events', 'users', 'bookings'];

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
        toast.success('Event created!');
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(26,18,9,0.5)', backdropFilter: 'blur(4px)' }}>
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
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="input-label">Event Title *</label>
              <input type="text" className="input-field" placeholder="Amazing Tech Conference 2025" {...register('title', { required: 'Title required' })} />
            </div>
            <div>
              <label className="input-label">Category *</label>
              <select className="input-field" {...register('category', { required: 'Category required' })}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Date *</label>
              <input type="date" className="input-field" {...register('date', { required: 'Date required' })} />
            </div>
            <div>
              <label className="input-label">Location / City *</label>
              <input type="text" className="input-field" placeholder="New York, NY" {...register('location', { required: 'Location required' })} />
            </div>
            <div>
              <label className="input-label">Venue Name</label>
              <input type="text" className="input-field" placeholder="Madison Square Garden" {...register('venue')} />
            </div>
            <div>
              <label className="input-label">Price ($) *</label>
              <input type="number" min="0" step="0.01" className="input-field" placeholder="0 for free events" {...register('price', { required: 'Price required', min: 0 })} />
            </div>
            <div>
              <label className="input-label">Total Tickets *</label>
              <input type="number" min="1" className="input-field" placeholder="100" {...register('totalTickets', { required: 'Total tickets required', min: 1 })} />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Description *</label>
              <textarea rows={4} className="input-field resize-none" placeholder="Tell people about your event..." {...register('description', { required: 'Description required' })} />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Tags (comma-separated)</label>
              <input type="text" className="input-field" placeholder="networking, tech, innovation" {...register('tags')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2 mt-4">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (editEvent ? 'Save Changes' : 'Create Event')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, eRes, uRes, bRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getEvents(),
        adminAPI.getUsers(),
        bookingsAPI.getAll(),
      ]);
      setStats(sRes.data.stats);
      setEvents(eRes.data.events);
      setUsers(uRes.data.users);
      setBookings(bRes.data.bookings);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEventStatus = async (id, status) => {
    try {
      await adminAPI.updateEventStatus(id, status);
      toast.success(`Event ${status}!`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Permanently delete this event?')) return;
    try {
      await adminAPI.deleteEvent(id);
      toast.success('Event deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      toast.success('User status updated');
      fetchData();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.changeRole(id, role);
      toast.success('Role updated');
      fetchData();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const pendingEvents = events.filter((e) => e.status === 'pending');

  return (
    <div className="dash-page">
      <div className="section-header">
        <span className="label-tag">Admin Dashboard</span>
        <h1 className="section-title">Manage Platform</h1>
      </div>

      <div className="auth-tabs" style={{ marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`auth-tab${activeTab === tab ? ' active' : ''}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
            {tab === 'events' && pendingEvents.length > 0 && ` (${pendingEvents.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="cv-spinner" />
      ) : (
        <div className="dash-main">
          {activeTab === 'events' && (
            <div>
              <h3 className="dash-sidebar-title">All Events ({events.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="cv-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev._id}>
                        <td>{ev.title}</td>
                        <td>{ev.organizer?.name}</td>
                        <td>{formatDate(ev.date)}</td>
                        <td>
                          <span className={`status-badge status-${ev.status}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {ev.status === 'pending' && (
                              <>
                                <button onClick={() => handleEventStatus(ev._id, 'approved')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Approve</button>
                                <button onClick={() => handleEventStatus(ev._id, 'rejected')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Reject</button>
                              </>
                            )}
                            {ev.status === 'approved' && (
                              <button onClick={() => handleEventStatus(ev._id, 'rejected')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Reject</button>
                            )}
                            {ev.status === 'rejected' && (
                              <button onClick={() => handleEventStatus(ev._id, 'approved')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Approve</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="dash-sidebar-title">All Users ({users.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="cv-table">
                  <thead>
                    <tr><th>User</th><th>Email</th><th>Role</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'bookings' && (
             <div>
              <h3 className="dash-sidebar-title">All Bookings ({bookings.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="cv-table">
                  <thead>
                    <tr><th>Reference</th><th>User</th><th>Event</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td>{b.bookingReference}</td>
                        <td>{b.user?.name}</td>
                        <td>{b.event?.title}</td>
                        <td style={{ textTransform: 'capitalize' }}>{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'overview' && (
             <div>
              <h3 className="dash-sidebar-title">Pending Events</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="cv-table">
                  <thead>
                    <tr><th>Event</th><th>Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {pendingEvents.map((ev) => (
                      <tr key={ev._id}>
                        <td>{ev.title}</td>
                        <td>{formatDate(ev.date)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEventStatus(ev._id, 'approved')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Approve</button>
                            <button onClick={() => handleEventStatus(ev._id, 'rejected')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pendingEvents.length === 0 && <tr><td colSpan="3">No pending events.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
