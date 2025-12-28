import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Stories } from './pages/Stories';
import { Research } from './pages/Research';
import { Contacts } from './pages/Contacts';
import { ContactProfile } from './pages/ContactProfile';
import { EmailOutreach } from './pages/EmailOutreach';
import { Questions } from './pages/Questions';
import { Meetings } from './pages/Meetings';
import { Transcripts } from './pages/Transcripts';
import { ArticleDraft } from './pages/ArticleDraft';
import { EditorialReview } from './pages/EditorialReview';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/Logo.png" alt="Auric" style={{ width: '48px', height: '48px', marginBottom: '1rem' }} />
          <p className="text-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public route wrapper (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="stories" element={<Stories />} />
        <Route path="research" element={<Research />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="contacts/:id" element={<ContactProfile />} />
        <Route path="email" element={<EmailOutreach />} />
        <Route path="questions" element={<Questions />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="transcripts" element={<Transcripts />} />
        <Route path="drafts" element={<ArticleDraft />} />
        <Route path="review" element={<EditorialReview />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
