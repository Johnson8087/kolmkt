// Remove this line
// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ProfileList from './components/ProfileList';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Navigate to="/profiles" />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <PrivateRoute>
                <ProfileList />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/profiles" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
