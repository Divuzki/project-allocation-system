# Test Cases for Project Allocation System

This chapter outlines the comprehensive test cases for the Student Project Allocation and Verification System. These test cases are designed to validate the functionality, security, and usability of the system across different user roles and scenarios.

## Test Case Table

| Test ID | Description | Input | Expected Output | Result |
|---------|-------------|-------|-----------------|--------|
| TC-001 | User Registration - Student | Name: "John Doe"<br>Email: "john@example.com"<br>Password: "password123"<br>Role: "student" | Status: 201<br>Response: JSON with success flag, token, and user details | |
| TC-002 | User Registration - Duplicate Email | Name: "Jane Doe"<br>Email: "john@example.com" (existing)<br>Password: "password456"<br>Role: "student" | Status: 400<br>Response: JSON with error message "User already exists" | |
| TC-003 | User Login - Valid Credentials | Email: "john@example.com"<br>Password: "password123" | Status: 200<br>Response: JSON with success flag, token, and user details | |
| TC-004 | User Login - Invalid Credentials | Email: "john@example.com"<br>Password: "wrongpassword" | Status: 401<br>Response: JSON with error message "Invalid credentials" | |
| TC-005 | Get Current User | Valid JWT token in Authorization header | Status: 200<br>Response: JSON with user details | |
| TC-006 | Project Title Check - Unique | Title: "Unique Project Title" | Status: 200<br>Response: JSON with exists: false | |
| TC-007 | Project Title Check - Duplicate | Title: "Existing Project Title" | Status: 200<br>Response: JSON with exists: true | |
| TC-008 | Project Submission - Valid | Title: "AI in Education"<br>Description: "Exploring AI applications in education"<br>Supervisor: Valid supervisor ID | Status: 201<br>Response: JSON with project details | |
| TC-009 | Project Submission - Invalid (Missing Fields) | Title: "AI in Education"<br>(Missing description) | Status: 400<br>Response: JSON with validation error message | |
| TC-010 | Project Submission - Duplicate Title | Title: "Existing Project Title"<br>Description: "Some description" | Status: 400<br>Response: JSON with error message about duplicate title | |
| TC-011 | Get All Projects - Student | Valid student JWT token | Status: 200<br>Response: JSON with only projects submitted by the logged-in student | |
| TC-012 | Get All Projects - Supervisor | Valid supervisor JWT token | Status: 200<br>Response: JSON with only projects assigned to the logged-in supervisor | |
| TC-013 | Get All Projects - Admin | Valid admin JWT token | Status: 200<br>Response: JSON with all projects in the system | |
| TC-014 | Get Single Project - Authorized | Valid JWT token of project owner or assigned supervisor | Status: 200<br>Response: JSON with project details | |
| TC-015 | Get Single Project - Unauthorized | Valid JWT token of user not associated with the project | Status: 403<br>Response: JSON with error message about authorization | |
| TC-016 | Update Project Status - Supervisor | Project ID: Valid ID<br>Status: "approved"<br>Feedback: "Good project proposal" | Status: 200<br>Response: JSON with updated project details | |
| TC-017 | Update Project Status - Unauthorized | Student attempting to update project status | Status: 403<br>Response: JSON with error message about authorization | |
| TC-018 | Delete Project - Admin | Project ID: Valid ID | Status: 200<br>Response: JSON with success message | |
| TC-019 | Delete Project - Unauthorized | Non-admin user attempting to delete project | Status: 403<br>Response: JSON with error message about authorization | |
| TC-020 | Get Supervisors List - Student | Valid student JWT token | Status: 200<br>Response: JSON with list of available supervisors | |

## Test Environment Setup

All tests should be conducted in a controlled environment with the following configuration:

- Node.js version: v14.x or higher
- MongoDB version: v4.4 or higher
- Test database separate from production
- JWT secret key configured for testing

## Test Execution Guidelines

1. Execute tests in the order specified in the test case table
2. Record actual results in the "Result" column
3. For failed tests, document the actual behavior and error messages
4. Retest failed cases after fixes are implemented

## Automated Testing

The system includes automated tests using Jest and Supertest for API testing. To run the automated test suite:

```
cd backend
npm run test
```

The automated test suite covers all the test cases listed in the table above, providing consistent and repeatable validation of system functionality.

## Security Testing

In addition to functional testing, security testing should be performed to ensure:

1. Password hashing is working correctly
2. JWT authentication prevents unauthorized access
3. Role-based access control is enforced properly
4. Input validation prevents injection attacks

## Performance Testing

Performance testing should be conducted to ensure the system can handle the expected load:

1. Concurrent user login (50+ simultaneous users)
2. Project submission under load
3. Database query performance with 1000+ projects

## Conclusion

These test cases provide comprehensive coverage of the system's functionality and security features. By following this testing plan, the development team can ensure that the Student Project Allocation and Verification System meets all requirements and provides a reliable, secure platform for managing student projects.