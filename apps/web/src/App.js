/**
 * SMART LEAVE & ATTENDANCE MANAGEMENT SYSTEM
 * Main Application File with Route Configuration
 * 
 * Routes Structure:
 * - /login - Public login page
 * - /student - Student Dashboard (Apply Leave)
 * - /student/applications - Student Applications (View all applications)
 * - /faculty - Faculty Dashboard (Class Teacher, HOD, Dean - Pending approvals)
 * - /coordinator - Coordinator Dashboard (Attendance Coordinator - Mark attendance)
 * - / - Redirects to login
 * - * - Redirects to login
 * 
 * WORKFLOW:
 * Student → Class Teacher → HOD → Dean → Attendance Coordinator → Complete
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentApplications from './pages/StudentApplications';
import FacultyDashboard from './pages/FacultyDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import './styles/theme.css';

// ============================================
// AUTHENTICATION UTILITIES
// ============================================

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && token !== '' && token !== 'undefined';
};

/**
 * Get current user role from localStorage
 * @returns {string|null} - User role or null
 */
const getUserRole = () => {
  return localStorage.getItem('userRole');
};

/**
 * Get current user name
 * @returns {string} - User name
 */
const getUserName = () => {
  return localStorage.getItem('userName') || 'User';
};

/**
 * Get current user ID
 * @returns {string|null} - User ID
 */
const getUserId = () => {
  return localStorage.getItem('userId');
};

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

/**
 * Protected Route wrapper
 * Redirects to login if not authenticated
 * Redirects to appropriate dashboard if role doesn't match
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} props.allowedRoles - Array of allowed roles for this route
 * @returns {React.ReactNode} - Protected route component
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  // Not authenticated - redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'student') {
      return <Navigate to="/student" replace />;
    }
    if (userRole === 'teacher' || userRole === 'hod' || userRole === 'dean') {
      return <Navigate to="/faculty" replace />;
    }
    if (userRole === 'coordinator') {
      return <Navigate to="/coordinator" replace />;
    }
    // Unknown role - redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  return (
    <Router>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES */}
        {/* ============================================ */}
        <Route path="/login" element={<Login />} />

        {/* ============================================ */}
        {/* STUDENT ROUTES */}
        {/* ============================================ */}
        {/* Student Dashboard - Apply for leave */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Applications - View all applications */}
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentApplications />
            </ProtectedRoute>
          }
        />

        {/* Catch-all student route - redirect to dashboard */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Navigate to="/student" replace />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* FACULTY ROUTES (Class Teacher, HOD, Dean) */}
        {/* ============================================ */}
        {/* Faculty Dashboard - Pending approvals */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'hod', 'dean']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all faculty route - redirect to dashboard */}
        <Route
          path="/faculty/*"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'hod', 'dean']}>
              <Navigate to="/faculty" replace />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* COORDINATOR ROUTES (Attendance Coordinator) */}
        {/* ============================================ */}
        {/* Coordinator Dashboard - Mark attendance */}
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={['coordinator']}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all coordinator route - redirect to dashboard */}
        <Route
          path="/coordinator/*"
          element={
            <ProtectedRoute allowedRoles={['coordinator']}>
              <Navigate to="/coordinator" replace />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* DEFAULT REDIRECTS */}
        {/* ============================================ */}
        {/* Root path - redirect based on authentication */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              (() => {
                const role = getUserRole();
                if (role === 'student') return <Navigate to="/student" replace />;
                if (role === 'teacher' || role === 'hod' || role === 'dean') return <Navigate to="/faculty" replace />;
                if (role === 'coordinator') return <Navigate to="/coordinator" replace />;
                return <Navigate to="/login" replace />;
              })()
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all 404 - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// ============================================
// EXPORTS FOR USE IN OTHER COMPONENTS
// ============================================

export { isAuthenticated, getUserRole, getUserName, getUserId };
export default App;