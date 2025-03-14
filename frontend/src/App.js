import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetails from './components/projects/ProjectDetails';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import NotFound from './components/pages/NotFound';

// Context
import AuthContext, { AuthProvider } from './context/AuthContext';

// CSS
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/projects/new" element={
              <PrivateRoute roles={['student']}>
                <ProjectForm />
              </PrivateRoute>
            } />
            <Route path="/projects/:id" element={
              <PrivateRoute>
                <ProjectDetails />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute roles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

// Private Route Component
const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default App;