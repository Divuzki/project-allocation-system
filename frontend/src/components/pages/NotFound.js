import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h1 className="display-4">404</h1>
          <h2>Page Not Found</h2>
          <p className="lead">The page you are looking for does not exist or has been moved.</p>
          <Link to="/">
            <Button variant="primary">Return to Home</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;