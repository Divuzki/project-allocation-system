import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ProjectForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    supervisor: ''
  });
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [checkingTitle, setCheckingTitle] = useState(false);
  const [titleTimeout, setTitleTimeout] = useState(null);
  
  const { title, description, supervisor } = formData;
  
  // Fetch supervisors on component mount
  useEffect(() => {
    const fetchSupervisors = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/users/supervisors');
        setSupervisors(res.data.data);
      } catch (err) {
        setError('Error fetching supervisors');
      }
      setLoading(false);
    };
    
    fetchSupervisors();
  }, []);
  
  // Check for duplicate title with debounce
  useEffect(() => {
    // Clear any existing timeout
    if (titleTimeout) {
      clearTimeout(titleTimeout);
    }
    
    // Reset title error when title changes
    setTitleError('');
    
    // Don't check empty titles
    if (!title.trim()) {
      return;
    }
    
    // Set a new timeout to check title after user stops typing
    const timeout = setTimeout(async () => {
      setCheckingTitle(true);
      try {
        const res = await axios.get(`/api/projects/check-title?title=${encodeURIComponent(title)}`);
        if (res.data.exists) {
          setTitleError('This topic already exists.');
        }
      } catch (err) {
        setTitleError('Unable to verify title availability. Please try again.');
      } finally {
        setCheckingTitle(false);
      }
    }, 500);
    
    setTitleTimeout(timeout);
    
    // Cleanup function
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [title]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Update the form submission error handling
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
  
    if (!title || !description || !supervisor) {
      setError('Please fill in all fields');
      return;
    }
  
    if (titleError) {
      setError('Please fix the title error before submitting');
      return;
    }
  
    setSubmitLoading(true);
  
    try {
      const res = await axios.post('/api/projects', formData);
      if(res.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      const serverError = err.response?.data?.error || 'Error submitting project';
      setError(serverError);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  return (
    <div className="form-container">
      <Card>
        <Card.Body>
          <h2 className="form-title">Submit New Project</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Project Title</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  name="title"
                  value={title}
                  onChange={onChange}
                  placeholder="Enter project title"
                  required
                  isInvalid={!!titleError}
                  className={checkingTitle ? 'pr-5' : ''}
                />
                {checkingTitle && (
                  <div className="position-absolute" style={{ right: '10px', top: '8px' }}>
                    <Spinner animation="border" size="sm" />
                  </div>
                )}
                {titleError && (
                  <Form.Control.Feedback type="invalid">
                    {titleError}
                  </Form.Control.Feedback>
                )}
              </div>
              <Form.Text className="text-muted">
                Choose a clear, descriptive title for your project
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Describe your project in detail"
                required
              />
              <Form.Text className="text-muted">
                Include objectives, methodology, and expected outcomes
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="supervisor">
              <Form.Label>Supervisor</Form.Label>
              <Form.Select
                name="supervisor"
                value={supervisor}
                onChange={onChange}
                required
              >
                <option value="">Select a supervisor</option>
                {supervisors.map(sup => (
                  <option key={sup._id} value={sup._id}>
                    {sup.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={submitLoading || checkingTitle || !!titleError}
            >
              {submitLoading ? 'Submitting...' : 'Submit Project'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectForm;