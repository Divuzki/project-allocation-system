import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        setProjects(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const StudentDashboard = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Projects</h2>
        <Link to="/projects/new">
          <Button variant="primary">Submit New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Alert variant="info">
          You haven't submitted any projects yet. Click the button above to submit a new project.
        </Alert>
      ) : (
        <Row>
          {projects.map(project => (
            <Col md={6} lg={4} key={project._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Status: <span className={`text-${getStatusColor(project.status)}`}>{project.status}</span>
                  </Card.Subtitle>
                  <Card.Text>
                    {project.description.substring(0, 100)}...
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">Supervisor: {project.supervisor.name}</small>
                  </Card.Text>
                  <Link to={`/projects/${project._id}`}>
                    <Button variant="outline-primary" size="sm">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );

  const SupervisorDashboard = () => (
    <>
      <h2 className="mb-4">Projects to Review</h2>
      
      {projects.length === 0 ? (
        <Alert variant="info">
          You don't have any projects assigned to you for review.
        </Alert>
      ) : (
        <Row>
          {projects.map(project => (
            <Col md={6} lg={4} key={project._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Status: <span className={`text-${getStatusColor(project.status)}`}>{project.status}</span>
                  </Card.Subtitle>
                  <Card.Text>
                    {project.description.substring(0, 100)}...
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">Student: {project.student.name}</small>
                  </Card.Text>
                  <Link to={`/projects/${project._id}`}>
                    <Button variant="outline-primary" size="sm">Review Project</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );

  const AdminDashboard = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>System Overview</h2>
        <Link to="/admin/users">
          <Button variant="primary">Manage Users</Button>
        </Link>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.length}</h3>
              <p>Total Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.filter(p => p.status === 'approved').length}</h3>
              <p>Approved Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.filter(p => p.status === 'submitted').length}</h3>
              <p>Pending Review</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-3">Recent Projects</h3>
      <Row>
        {projects.slice(0, 6).map(project => (
          <Col md={6} lg={4} key={project._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Status: <span className={`text-${getStatusColor(project.status)}`}>{project.status}</span>
                </Card.Subtitle>
                <Card.Text>
                  <small className="text-muted">Student: {project.student.name}</small>
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">Supervisor: {project.supervisor.name}</small>
                </Card.Text>
                <Link to={`/projects/${project._id}`}>
                  <Button variant="outline-primary" size="sm">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  // Helper function to get bootstrap color class based on status
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

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      {user && user.role === 'student' && <StudentDashboard />}
      {user && user.role === 'supervisor' && <SupervisorDashboard />}
      {user && user.role === 'admin' && <AdminDashboard />}
    </Container>
  );
};

export default Dashboard;