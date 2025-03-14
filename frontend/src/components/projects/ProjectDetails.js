import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Badge, Form, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`);
        setProject(res.data.data);
        setFeedback(res.data.data.feedback || '');
        setStatus(res.data.data.status);
        setLoading(false);
      } catch (err) {
        setError('Error fetching project details: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };
  
  const confirmStatusUpdate = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await axios.put(`/api/projects/${id}`, {
        status,
        feedback
      });
      
      setProject(res.data.data);
      setSuccessMessage(`Project status updated to ${status}`);
      setSubmitting(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error updating project: ' + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="warning">Submitted</Badge>;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  if (!project) {
    return (
      <Alert variant="danger">
        Project not found or you don't have permission to view it.
      </Alert>
    );
  }
  
  return (
    <div className="project-details-container py-4">
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>{project.title}</h2>
          <div>{getStatusBadge(project.status)}</div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5>Description</h5>
              <p>{project.description}</p>
              
              {project.feedback && (
                <div className="mt-4">
                  <h5>Feedback</h5>
                  <Alert variant="info">{project.feedback}</Alert>
                </div>
              )}
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Project Details</h5>
                  <p><strong>Student:</strong> {project.student.name}</p>
                  <p><strong>Supervisor:</strong> {project.supervisor.name}</p>
                  <p><strong>Submission Date:</strong> {new Date(project.submissionDate).toLocaleDateString()}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`ms-2 text-${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </p>
                </Card.Body>
              </Card>
              
              {/* Show review form for supervisors */}
              {user && (user.role === 'supervisor' || user.role === 'admin') && (
                <Card>
                  <Card.Body>
                    <h5>Review Project</h5>
                    <Form onSubmit={handleStatusUpdate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select 
                          value={status} 
                          onChange={(e) => setStatus(e.target.value)}
                          required
                        >
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Feedback</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4} 
                          value={feedback} 
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Provide feedback to the student"
                        />
                        <Form.Text className="text-muted">
                          Please provide constructive feedback to help the student understand your decision.
                        </Form.Text>
                      </Form.Group>
                      
                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        disabled={submitting}
                      >
                        {submitting ? 'Updating...' : 'Update Project'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
          
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to change the project status to <strong>{status}</strong>?</p>
          {status === 'rejected' && !feedback && (
            <Alert variant="warning">
              You are rejecting this project without providing feedback. Consider adding feedback to help the student understand your decision.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={status === 'approved' ? 'success' : (status === 'rejected' ? 'danger' : 'primary')}
            onClick={confirmStatusUpdate}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectDetails;