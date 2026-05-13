import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'organizer') return '/organizer';
    return '/dashboard';
  };

  return (
    <nav className="cv-nav">
      <div className="cv-nav-inner">
        {/* Logo */}
        <Link to="/" className="cv-logo">
          <div className="cv-logo-icon" />
          Convene
        </Link>

        {/* Center links */}
        <div className="cv-nav-links">
          <NavLink to="/" end className={({ isActive }) => 'cv-nav-link' + (isActive ? ' active' : '')}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => 'cv-nav-link' + (isActive ? ' active' : '')}>
            Events
          </NavLink>
          <NavLink to="/testimonials" className={({ isActive }) => 'cv-nav-link' + (isActive ? ' active' : '')}>
            Testimonials
          </NavLink>
          {user && (
            <NavLink to="/organizer" className={({ isActive }) => 'cv-nav-link' + (isActive ? ' active' : '')}>
              Host
            </NavLink>
          )}
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => 'cv-nav-link' + (isActive ? ' active' : '')}>
              My Events
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => 'cv-nav-link' + (isActive ? ' active' : '')}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className="cv-nav-actions">
          {user ? (
            <>
              {user.role === 'admin' && (
                <button className="btn-admin" onClick={() => navigate('/admin')}>
                  🛡 Admin
                </button>
              )}
              <button className="btn-signout" onClick={handleLogout}>
                ↪ Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ fontSize: '0.85rem' }}>
                🛡 Admin
              </Link>
              <Link to="/login" className="btn-ghost" style={{ fontSize: '0.85rem' }}>
                Sign in
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                👤 Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
