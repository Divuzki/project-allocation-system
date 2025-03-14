import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <Nav className="ms-auto">
      {user && user.role === 'admin' && (
        <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
      )}
      <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
      <Nav.Item>
        <Button variant="outline-light" onClick={handleLogout} className="ms-2">
          Logout
        </Button>
      </Nav.Item>
    </Nav>
  );

  const guestLinks = (
    <Nav className="ms-auto">
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/register">Register</Nav.Link>
    </Nav>
  );

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Project Allocation System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? authLinks : guestLinks}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;