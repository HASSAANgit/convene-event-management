import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-back" onClick={() => navigate(-1)}>← back</button>

      <h1 className="auth-title">Create account.</h1>
      <p className="auth-subtitle">Join Convene to host and manage your events.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label className="cv-label" htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            name="name"
            type="text"
            className="cv-input"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="cv-label" htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            name="email"
            type="email"
            className="cv-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="cv-label" htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            name="password"
            type="password"
            className="cv-input"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?
        <button onClick={() => navigate('/login')}>Sign in →</button>
      </p>
    </div>
  );
}
