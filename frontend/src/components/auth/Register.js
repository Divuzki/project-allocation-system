import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, password2, role } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    // Remove password2 from data sent to API
    const registerData = {
      name,
      email,
      password,
      role
    };
    
    const success = await register(registerData);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <Card>
        <Card.Body>
          <h2 className="form-title">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                value={password2}
                onChange={onChange}
                placeholder="Confirm your password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={role}
                onChange={onChange}
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Admin accounts can only be created by existing admins
              </Form.Text>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;