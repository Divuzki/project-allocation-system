# Student Project Allocation and Verification System

## Overview

The Student Project Allocation and Verification System is a web-based application designed to automate and streamline the process of allocating student projects and verifying their progress. Built using the MERN stack (MongoDB, Express.js, React, Node.js), this system provides a comprehensive solution for educational institutions to manage the entire project allocation workflow.

## Features

- **User Role Management**: Support for multiple user roles (students, supervisors, administrators) with role-specific permissions and interfaces
- **Project Submission**: Students can submit project proposals with detailed descriptions
- **Project Approval Workflow**: Supervisors can review, approve, or reject project proposals with feedback
- **Project Tracking**: Monitor project status throughout its lifecycle
- **Secure Authentication**: JWT-based authentication system with encrypted passwords
- **Responsive UI**: Mobile-friendly interface built with React and Bootstrap

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcryptjs**: Password hashing library

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: Navigation for single page applications
- **Bootstrap/React-Bootstrap**: Responsive UI components
- **Axios**: Promise-based HTTP client
- **React-Toastify**: Notification system

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

### Local Development Setup

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd project-allocation-system-1
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/project-allocation
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

3. **Install backend dependencies**
   ```
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```
   cd ../frontend
   npm install
   ```

5. **Run the development servers**

   In the backend directory:
   ```
   npm run dev
   ```

   In the frontend directory:
   ```
   npm start
   ```

   The backend server will run on http://localhost:5000 and the frontend development server will run on http://localhost:3000.

### Building for Production

1. **Build the frontend**
   ```
   cd frontend
   npm run build
   ```
   This will create a production build and copy it to the backend's public directory.

2. **Start the production server**
   ```
   cd ../backend
   npm start
   ```

## Docker Deployment

The application can be deployed using Docker and Docker Compose:

1. **Build and start the containers**
   ```
   docker-compose up -d
   ```

   This will start both the MongoDB database and the MERN application.

2. **Access the application**
   
   The application will be available at http://localhost:5000

## Environment Variables

### Backend Environment Variables

- `NODE_ENV`: Application environment (development, production)
- `PORT`: Port on which the server will run
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: JWT token expiration time
- `FRONTEND_URL`: URL of the frontend (for CORS configuration in production)

## Project Structure

```
├── backend/                # Backend Node.js/Express application
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── public/             # Static files (built React app)
│   ├── server.js           # Express app entry point
│   └── package.json        # Backend dependencies
├── frontend/              # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # React source files
│   │   ├── components/     # React components
│   │   ├── context/        # React context (state management)
│   │   └── App.js          # Main React component
│   └── package.json        # Frontend dependencies
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # Project documentation
```

## Usage

1. **Register as a user** (student, supervisor, or admin)
2. **Log in** with your credentials
3. **Students**: Submit project proposals and track their status
4. **Supervisors**: Review and approve/reject student project proposals
5. **Administrators**: Manage users and oversee the entire system

## License

[MIT License](LICENSE)

## Contributors

- [Divine Ikhuoria](https://github.com/divuzki)