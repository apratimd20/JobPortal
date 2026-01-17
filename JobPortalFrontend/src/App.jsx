import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LandingPage from './components/LandingPage.jsx';
import LogoutConfirmModal from './components/LogoutConfirmModal.jsx';
import JobPortal from './JobPortal.jsx';
import JobProviderDashboard from './JobProviderDashboard.jsx';
import JobSeekerDashboard from './JobSeekerDashboard.jsx';
import JobDetails from './components/JobDetails.jsx';
import SavedJobs from './components/SavedJobs.jsx';
import Profile from './components/Profile.jsx';
import Settings from './components/Settings.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Check authentication on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedUser && storedRole) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          token: storedToken
        });
        setRole(storedRole);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        handleLogout();
      }
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    // Clear all localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    toast.info('Logged out successfully', {
      position: "top-right",
      autoClose: 2000,
    });

    setUser(null);
    setRole(null);
    setShowLogoutConfirm(false);

    // Redirect to landing page
    window.location.href = '/';
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');

    if (!token || !currentRole) {
      return <Navigate to="/" replace />;
    }

    if (allowedRole && currentRole !== allowedRole) {
      // Redirect to appropriate dashboard if role doesn't match
      if (currentRole === 'jobseeker') {
        return <Navigate to="/dashboard/seeker" replace />;
      } else if (currentRole === 'jobprovider') {
        return <Navigate to="/dashboard/provider" replace />;
      }
    }

    return children;
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />

      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Job Seeker Routes */}
          <Route
            path="/dashboard/seeker"
            element={
              <ProtectedRoute allowedRole="jobseeker">
                <JobPortal />
              </ProtectedRoute>
            }
          />

          {/* Job Provider Routes */}
          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute allowedRole="jobprovider">
                <JobProviderDashboard user={user} onLogout={handleLogoutClick} />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/job/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute allowedRole="jobseeker">
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

