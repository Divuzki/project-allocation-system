# Multi-stage build for MERN stack application optimized for Railway.app

# Stage 1: Build the React frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source code and build
COPY frontend/ ./
# Set the PUBLIC_URL environment variable to ensure correct asset paths
ARG PUBLIC_URL=/
ENV PUBLIC_URL=$PUBLIC_URL
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

# Set environment variables - Railway will inject these at runtime
ENV NODE_ENV=production
# Use PORT variable that Railway automatically assigns
ENV PORT=$PORT

# Expose the port - Railway will automatically route to this port
EXPOSE $PORT

# Command to run the application
CMD ["node", "server.js"]