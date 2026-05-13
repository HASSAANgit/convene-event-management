import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO_USER = { email: 'user@demo.com', password: 'Convene-Demo-2026!' };
const DEMO_ADMIN = { email: 'admin@demo.com', password: 'Admin-Demo-2026!' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]           = useState('user'); // 'user' | 'admin'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const demo = tab === 'user' ? DEMO_USER : DEMO_ADMIN;

  const useDemoAccount = () => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      toast.success(`Welcome back${user.name ? ', ' + user.name.split(' ')[0] : ''}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'organizer') navigate('/organizer');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Back */}
      <button className="auth-back" onClick={() => navigate(-1)}>
        ← back
      </button>

      {/* Tabs */}
      <div className="auth-tabs">
        <button
          className={`auth-tab${tab === 'user' ? ' active' : ''}`}
          onClick={() => setTab('user')}
        >
          👤 User portal
        </button>
        <button
          className={`auth-tab${tab === 'admin' ? ' active' : ''}`}
          onClick={() => setTab('admin')}
        >
          🛡 Admin portal
        </button>
      </div>

      {/* Heading */}
      <h1 className="auth-title">
        {tab === 'user' ? 'User sign in.' : 'Admin sign in.'}
      </h1>
      <p className="auth-subtitle">
        {tab === 'user'
          ? 'Sign in with the demo guest account to host and submit events.'
          : 'Sign in with your admin credentials to manage events.'}
      </p>

      {/* Demo credentials */}
      <div className="demo-box">
        <div className="demo-box-label">🔑 Demo credentials</div>
        <div className="demo-row">
          <span className="demo-key">email</span>
          <span className="demo-val">{demo.email}</span>
        </div>
        <div className="demo-row">
          <span className="demo-key">password</span>
          <span className="demo-val">{demo.password}</span>
        </div>
        <button className="demo-use-btn" onClick={useDemoAccount}>
          Use demo {tab} account
        </button>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label className="cv-label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            className="cv-input"
            placeholder={demo.email}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="cv-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            className="cv-input"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account?
        <button onClick={() => navigate('/register')}>Create one →</button>
      </p>
    </div>
  );
}
