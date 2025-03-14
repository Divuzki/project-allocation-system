import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = useCallback(async () => {
    if (token) {
      setAuthToken(token);
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.data);
        setIsAuthenticated(true);
      } catch (err) {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, [token]); // Added token dependency

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setAuthToken(res.data.token);
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setAuthToken(res.data.token);
      toast.success('Login successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    toast.info('Logged out successfully');
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;