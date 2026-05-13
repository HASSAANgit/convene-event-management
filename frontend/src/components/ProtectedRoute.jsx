import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { MdEventNote } from 'react-icons/md';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center space-y-5">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="inline-block"
          >
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto"
              style={{ background: 'var(--accent)' }}>
              <MdEventNote className="text-white text-3xl" />
            </div>
          </motion.div>
          <div>
            <div className="cv-spinner" style={{ margin: '0 auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', fontWeight: 500 }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const dashMap = { admin: '/admin', organizer: '/organizer', user: '/dashboard' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }

  return children;
}
