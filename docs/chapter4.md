# Chapter 4: Implementation

This chapter provides a detailed account of the implementation of the Student Project Allocation and Verification System, a web-based application designed to automate and streamline the process of allocating student projects and verifying their progress. Built using the MERN stack (MongoDB, Express.js, React, Node.js), the system enhances efficiency and transparency in educational institutions by managing the entire project allocation workflow. The implementation follows the Object-Oriented System Development Methodology (OOSDM), ensuring a modular, scalable, and maintainable solution. This chapter covers the system architecture, technology stack, development setup, key modules, database implementation, user interfaces, testing, deployment, and challenges encountered during development, with visual aids such as diagrams and screenshots included to enhance understanding.


## 4.1 System Architecture

The Student Project Allocation and Verification System adopts a client-server architecture. The frontend, developed with React, provides a responsive and interactive user interface, while the backend, powered by Node.js and Express.js, handles business logic, authentication, and database operations. MongoDB serves as the NoSQL database, offering flexible and scalable data storage. Communication between the frontend and backend occurs through RESTful APIs, ensuring a clear separation of concerns that facilitates maintenance and updates.

**Figure 4.1** illustrates the high-level architecture of the system.

**[Insert Figure 4.1: System Architecture Diagram]**  
*Description: A diagram showing the React frontend on the left, sending HTTP requests to the Express.js backend in the center, which processes these requests and interacts with the MongoDB database on the right. Arrows indicate the bidirectional flow of data and requests between these components, with labels clearly identifying each layer.*



## 4.2 Technology Stack

The system leverages the MERN stack, chosen for its flexibility, scalability, and seamless integration of JavaScript-based technologies. The technology stack is divided into backend and frontend components:

### Backend
- **Node.js**: JavaScript runtime environment for server-side execution.
- **Express.js**: Web application framework for building RESTful APIs.
- **MongoDB**: NoSQL database for flexible, schema-less data storage.
- **Mongoose**: Object modeling tool for MongoDB, simplifying schema definition and queries.
- **JWT**: JSON Web Tokens for secure, role-based authentication.
- **bcryptjs**: Library for hashing passwords to enhance security.

### Frontend
- **React**: JavaScript library for building dynamic user interfaces.
- **React Router**: Handles navigation within the single-page application.
- **Bootstrap/React-Bootstrap**: Provides responsive UI components and styling.
- **Axios**: Promise-based HTTP client for API requests.
- **React-Toastify**: Notification system for user feedback.

This combination ensures efficient full-stack development and a robust, user-friendly application.



## 4.3 Development Setup

Setting up the development environment requires Node.js (v14 or higher), npm (v6 or higher), and MongoDB (v4.4 or higher). The process involves cloning the repository, configuring environment variables, and installing dependencies for both the backend and frontend.

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd project-allocation-system-1
   ```

2. **Set Up Environment Variables**:  
   Create a `.env` file in the `backend` directory with:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/project-allocation
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

3. **Install Dependencies**:  
   - Backend: `cd backend && npm install`  
   - Frontend: `cd ../frontend && npm install`

4. **Run Development Servers**:  
   - Backend: `cd backend && npm run dev` (runs on http://localhost:5000)  
   - Frontend: `cd ../frontend && npm start` (runs on http://localhost:3000)

The project structure is organized into `backend` and `frontend` directories, enhancing modularity.

**Figure 4.2** shows the project directory structure.

**[Insert Figure 4.2: Project Directory Structure]**  
*Description: A tree diagram depicting the project organization, including `backend/` with subfolders like `middleware/`, `models/`, and `routes/`, and `frontend/` with subfolders such as `src/components/` and `src/context/`. Key files like `server.js` and `App.js` are highlighted.*



## 4.4 Key Modules and Features

The system includes several key modules to manage the project allocation process effectively.

### 4.4.1 Authentication Module
Authentication is implemented using JSON Web Tokens (JWT). User credentials are verified against the database, and a JWT token is generated upon successful login, enabling role-based access control for students, supervisors, and administrators. Passwords are hashed with bcryptjs for security.

**Figure 4.3** shows the login interface.

**[Insert Figure 4.3: Screenshot of Login Page]**  
*Description: A screenshot of the login form featuring a clean design with the university logo at the top, input fields for email and password, a dropdown menu for selecting the user role (student, supervisor, admin), and a "Login" button. The form is centered on a subtle gradient background.*

### 4.4.2 Project Submission Module
Students can submit project proposals via a dedicated form, including fields for project title, description, and attachments. Submissions are stored in MongoDB with a "pending" status.

**Figure 4.4** displays the project submission form.

**[Insert Figure 4.4: Screenshot of Project Submission Form]**  
*Description: A screenshot showing a form with labeled input fields for project title and description, a file upload section for attachments, and a "Submit" button, styled with Bootstrap for responsiveness.*

### 4.4.3 Project Approval Workflow
Supervisors review submitted proposals, provide feedback, and approve or reject them. Approved projects proceed to allocation, while rejected ones can be revised and resubmitted.

**Figure 4.5** illustrates the approval workflow.

**[Insert Figure 4.5: Sequence Diagram of Project Approval]**  
*Description: A sequence diagram depicting interactions: the student submits a proposal, the system notifies the supervisor, the supervisor reviews and approves/rejects it with feedback, and the system updates the proposal status accordingly.*



## 4.5 Database Implementation

MongoDB is utilized with Mongoose for object modeling. The database includes key collections such as `Users`, `Projects`, and `Submissions`, storing user details, project data, and submission records, respectively.

**Figure 4.6** presents the Mongoose schema for the Project model.

**[Insert Figure 4.6: Code Snippet of Project Schema]**  
*Description: A code snippet showing the Mongoose schema definition for the Project model, including fields like `title` (String), `description` (String), `status` (String, default: "pending"), `studentId` (ObjectId), and `supervisorId` (ObjectId).*



## 4.6 User Interfaces

The system provides tailored dashboards for each user role:

- **Student Dashboard**: Allows proposal submission and status tracking.
- **Supervisor Dashboard**: Facilitates review and management of proposals.
- **Admin Dashboard**: Oversees user management and system settings.

**Figure 4.7** shows the student dashboard.

**[Insert Figure 4.7: Screenshot of Student Dashboard]**  
*Description: A screenshot displaying a table of submitted projects with columns for title, status (e.g., "pending", "approved"), and submission date, alongside a "Submit New Proposal" button.*

**Figure 4.8** displays the supervisor dashboard.

**[Insert Figure 4.8: Screenshot of Supervisor Dashboard]**  
*Description: A screenshot showing a list of pending proposals with options to view details, approve, or reject each one, including a feedback input field.*



## 4.7 Testing

The system underwent rigorous testing to ensure functionality and reliability:

- **Unit Testing**: Jest was used for React components, and Mocha for backend routes.
- **Integration Testing**: Verified seamless interaction between frontend and backend APIs.
- **User Acceptance Testing (UAT)**: Conducted with students, supervisors, and administrators to validate usability.

**Figure 4.9** illustrates a sample test case for project submission.

**[Insert Figure 4.9: Sample Test Case Table]**  
*Description: A table with columns: Test ID (e.g., T01), Description ("Submit project proposal"), Input ("Title: 'AI Chatbot', Description: 'A chatbot system'"), Expected Output ("Proposal saved, status 'pending'"), Result ("Pass").*



## 4.8 Deployment

The system is deployed using Docker, containerizing the MERN application and MongoDB for consistency across environments. The deployment process involves:

```
docker-compose up -d
```

This command starts both containers in detached mode, making the application accessible at http://localhost:5000.

**Figure 4.10** shows the Docker deployment architecture.

**[Insert Figure 4.10: Docker Deployment Diagram]**  
*Description: A diagram depicting two Docker containers: one for MongoDB and one for the MERN application, with the application container exposing port 5000 and connecting to the database container.*



## 4.9 Challenges and Solutions

Several challenges arose during implementation:

- **Challenge 1**: Ensuring real-time updates for project statuses.  
  - **Solution**: Integrated WebSockets for live notifications, enhancing user experience.
- **Challenge 2**: Managing file uploads for project attachments.  
  - **Solution**: Utilized Multer middleware in Express.js for efficient file handling.



## 4.10 Conclusion

This chapter has outlined the implementation of the Student Project Allocation and Verification System, showcasing how the MERN stack and OOSDM were employed to develop a robust, user-friendly platform. Diagrams and screenshots provide a clear visual representation of the system’s architecture, features, and interfaces. Successful Docker deployment ensures scalability and ease of maintenance, laying the groundwork for future enhancements such as automated notifications and advanced analytics.

 

This structure, enriched with detailed descriptions and placeholders for images, mirrors the comprehensive and visually engaging style of Kosin’s Chapter 4, effectively conveying the implementation process of the system.