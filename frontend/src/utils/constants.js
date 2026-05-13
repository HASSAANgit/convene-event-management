export const CATEGORIES = [
  'Technology', 'Music', 'Sports', 'Business', 'Arts', 'Food', 'Health', 'Education', 'Other',
];

export const CATEGORY_ICONS = {
  Technology: '💻', Music: '🎵', Sports: '⚽', Business: '💼',
  Arts: '🎨', Food: '🍕', Health: '❤️', Education: '📚', Other: '✨',
};

export const CATEGORY_COLORS = {
  Technology: 'from-blue-500 to-cyan-500',
  Music: 'from-purple-500 to-pink-500',
  Sports: 'from-green-500 to-emerald-500',
  Business: 'from-amber-500 to-orange-500',
  Arts: 'from-rose-500 to-pink-500',
  Food: 'from-orange-500 to-red-500',
  Health: 'from-red-500 to-rose-500',
  Education: 'from-indigo-500 to-blue-500',
  Other: 'from-gray-500 to-slate-500',
};

export const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'badge-warning' },
  approved: { label: 'Approved', class: 'badge-success' },
  rejected: { label: 'Rejected', class: 'badge-danger' },
  completed: { label: 'Completed', class: 'badge-primary' },
  cancelled: { label: 'Cancelled', class: 'badge-danger' },
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  if (amount === 0) return 'Free';
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
};

export const timeUntilEvent = (date) => {
  const now = new Date();
  const eventDate = new Date(date);
  const diff = eventDate - now;
  if (diff < 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h away`;
  if (hours > 0) return `${hours}h away`;
  return 'Starting soon';
};
