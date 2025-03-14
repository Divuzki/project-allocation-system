import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsRes = await axios.get('/api/projects');
        setProjects(projectsRes.data.data);
        
        // Fetch users
        const usersRes = await axios.get('/api/users');
        setUsers(usersRes.data.data);
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count users by role
  const countUsersByRole = (role) => {
    return users.filter(user => user.role === role).length;
  };

  // Count projects by status
  const countProjectsByStatus = (status) => {
    return projects.filter(project => project.status === status).length;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{countUsersByRole('student')}</h3>
              <p>Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{countUsersByRole('supervisor')}</h3>
              <p>Supervisors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{countUsersByRole('admin')}</h3>
              <p>Administrators</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{projects.length}</h3>
              <p>Total Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{countProjectsByStatus('approved')}</h3>
              <p>Approved Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{countProjectsByStatus('submitted')}</h3>
              <p>Pending Review</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Projects</h5>
              <Link to="/admin/projects">
                <Button variant="outline-primary" size="sm">View All</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Student</th>
                    <th>Supervisor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map(project => (
                    <tr key={project._id}>
                      <td>{project.title}</td>
                      <td>{project.student.name}</td>
                      <td>{project.supervisor.name}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/projects/${project._id}`}>
                          <Button variant="outline-info" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">User Management</h5>
              <Link to="/admin/users">
                <Button variant="outline-primary" size="sm">Manage Users</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/users/${user._id}`}>
                          <Button variant="outline-info" size="sm" className="me-2">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

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

// Helper function to get bootstrap color class based on role
const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin':
      return 'danger';
    case 'supervisor':
      return 'info';
    default:
      return 'secondary';
  }
};

export default AdminDashboard;