# Multi-stage build for MERN stack application

# Stage 1: Build the React frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Set up the Node.js backend
FROM node:18-alpine
WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./
RUN npm install --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from the frontend-build stage
COPY --from=frontend-build /app/frontend/build ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]