import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage          from './pages/HomePage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import EventsPage        from './pages/EventsPage';
import EventDetailPage   from './pages/EventDetailPage';
import UserDashboard     from './pages/UserDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard    from './pages/AdminDashboard';
import TestimonialsPage  from './pages/TestimonialsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path="/events"       element={<EventsPage />} />
          <Route path="/events/:id"   element={<EventDetailPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />

          {/* My Events / User dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['user', 'organizer', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Host / Organizer dashboard */}
          <Route
            path="/organizer"
            element={
              <ProtectedRoute roles={['organizer', 'admin']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1209',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '4px',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.88rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            },
            success: { iconTheme: { primary: '#4a5f3a', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#8B3A2A', secondary: '#fff' } },
            duration: 4000,
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
