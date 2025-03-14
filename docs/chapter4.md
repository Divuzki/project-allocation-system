# Chapter 4: Implementation, Testing, and Deployment

## 4.1 Introduction

This chapter details the implementation, testing, and deployment processes of the Student Project Allocation System. Following the methodology and design outlined in Chapter 3, this chapter focuses on the practical aspects of bringing the system to life. The implementation leverages the MERN stack (MongoDB, Express.js, React, Node.js) to create a robust, scalable, and user-friendly application that effectively addresses the challenges identified in the manual allocation process.

The chapter is organized into three main sections:
1. Implementation details, including backend and frontend development
2. Testing strategies and results
3. Deployment procedures and maintenance practices

Each section provides comprehensive information about the approaches, technologies, and best practices employed to ensure the system meets all functional and non-functional requirements while maintaining high quality and reliability.

## 4.2 Implementation Details

### 4.2.1 Backend Implementation

The backend of the Student Project Allocation System was implemented using Node.js with Express.js as the web application framework. This combination provides a lightweight, flexible foundation for building RESTful APIs with excellent performance characteristics.

**Server Configuration:**

The main server configuration is defined in `server.js`, which sets up the Express application, middleware, routes, and database connection:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

The server configuration includes:
- Middleware setup for JSON parsing, CORS, and request logging
- Route definitions for authentication, projects, and users
- Global error handling middleware
- MongoDB connection using Mongoose
- Server initialization on the specified port

**Data Models:**

The system uses Mongoose schemas to define the structure of data stored in MongoDB. The two primary models are User and Project:

1. **User Model (`User.js`):**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'supervisor', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

The User model includes:
- Basic user information (name, email)
- Password field with automatic hashing using bcrypt
- Role-based access control with three roles: student, supervisor, and admin
- Methods for JWT generation and password verification

2. **Project Model (`Project.js`):**

```javascript
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted'
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  supervisor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  }
});

// Create index on title field for efficient duplicate checks
ProjectSchema.index({ title: 1 });
```

The Project model includes:
- Project details (title, description)
- Status tracking (submitted, approved, rejected)
- References to the student who submitted the project and the assigned supervisor
- Submission date and feedback fields
- An index on the title field for efficient duplicate checking

**Authentication Implementation:**

The system implements JWT-based authentication with middleware for protecting routes and authorizing access based on user roles:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
```

The authentication middleware includes:
- Token extraction from the Authorization header
- Token verification using the JWT secret
- User retrieval based on the decoded token
- Role-based authorization for restricting access to specific routes

### 4.2.2 Frontend Implementation

The frontend of the Student Project Allocation System was implemented using React, a popular JavaScript library for building user interfaces. The frontend follows a component-based architecture with context-based state management.

**Application Structure:**

The main application structure is defined in `App.js`, which sets up the routing and authentication context:

```javascript
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
```

The application structure includes:
- Route definitions for different pages
- Protected routes using the PrivateRoute component
- Role-based access control for specific routes
- Global authentication context using the AuthProvider

**Authentication Components:**

The system implements authentication using a combination of context-based state management and protected route components:

1. **Protected Route Component (`ProtectedRoute.js`):**

```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
```

The ProtectedRoute component:
- Checks if the user is authenticated
- Verifies if the user has the required role (if specified)
- Redirects to the login page if not authenticated
- Redirects to the dashboard if the user doesn't have the required role
- Shows a loading spinner while authentication state is being determined

2. **Login Component (`Login.js`):**

```javascript
import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    const success = await login(formData);
    
    if (success) {
      navigate('/dashboard');