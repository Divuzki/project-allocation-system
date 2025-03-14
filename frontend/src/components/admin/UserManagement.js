import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, InputGroup, FormControl, Badge, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever users, searchTerm or roleFilter changes
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users');
      setUsers(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching users: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(result);
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${currentUser._id}`, formData);
      setShowEditModal(false);
      setSuccessMessage(`User ${formData.name} updated successfully`);
      fetchUsers(); // Refresh user list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error updating user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/users/${currentUser._id}`);
      setShowDeleteModal(false);
      setSuccessMessage(`User ${currentUser.name} deleted successfully`);
      fetchUsers(); // Refresh user list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error deleting user: ' + (err.response?.data?.message || err.message));
    }
  };

  const clearError = () => {
    setError('');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">User Management</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={clearError}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <FormControl
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="role-filter-dropdown" className="w-100">
                  Filter by Role: {roleFilter === 'all' ? 'All' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setRoleFilter('all')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRoleFilter('student')}>Student</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRoleFilter('supervisor')}>Supervisor</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRoleFilter('admin')}>Admin</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3} className="text-end">
              <Badge bg="primary" className="me-2">
                Total: {filteredUsers.length}
              </Badge>
              <Button 
                variant="outline-secondary" 
                onClick={fetchUsers}
                title="Refresh user list"
              >
                Refresh
              </Button>
            </Col>
          </Row>
          
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No users found</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge bg-${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.role === 'admin' && filteredUsers.filter(u => u.role === 'admin').length <= 1}
                        title={user.role === 'admin' && filteredUsers.filter(u => u.role === 'admin').length <= 1 ? 
                          "Cannot delete the only admin user" : "Delete user"}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </Form.Select>
              {currentUser && currentUser.role === 'admin' && formData.role !== 'admin' && (
                <Form.Text className="text-danger">
                  Warning: Changing an admin to another role may affect system access.
                </Form.Text>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{currentUser?.name}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
          {currentUser?.role === 'supervisor' && (
            <Alert variant="warning">
              Warning: Deleting a supervisor may affect projects assigned to them.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
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

export default UserManagement;