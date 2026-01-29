import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import LiquorDetailsPage from './pages/LiquorDetailsPage';
import LoginPage from './pages/LoginPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark text-light flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark text-light flex items-center justify-center">Loading...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

// Route that redirects if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark text-light flex items-center justify-center">Loading...</div>;
  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/"} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout />
              </PublicRoute>
            }
          >
            <Route index element={<LoginPage />} />
          </Route>

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="liquors/:id" element={<LiquorDetailsPage />} />
          </Route>

          {/* Admin Route */}
          <Route path="/admin" element={
            <Layout>
              <AdminPage />
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
