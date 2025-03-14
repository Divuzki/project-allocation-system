import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Container>
      <Row className="my-5">
        <Col lg={8} className="mx-auto text-center">
          <h1>Welcome to the Project Allocation System</h1>
          <p className="lead">
            A platform for students to submit project proposals and get feedback from supervisors
          </p>
          {!isAuthenticated ? (
            <div className="mt-4">
              <Link to="/login">
                <Button variant="primary" className="me-3">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline-primary">Register</Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>For Students</Card.Title>
              <Card.Text>
                Submit your project proposals and track their approval status. Get feedback from supervisors.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>For Supervisors</Card.Title>
              <Card.Text>
                Review student project proposals, provide feedback, and approve or reject submissions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>For Administrators</Card.Title>
              <Card.Text>
                Manage users, oversee all projects, and ensure the smooth operation of the allocation system.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;