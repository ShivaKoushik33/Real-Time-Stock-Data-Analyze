# Use official Node.js image
FROM node:18

# Install Python 3
RUN apt-get update && apt-get install -y python3 python3-pip

# Create app directory
WORKDIR /app

# Copy backend files into container
COPY Backend/ ./Backend/

# Set working directory to backend
WORKDIR /app/Backend

# Install Node dependencies
RUN npm install

# Start the Node.js backend
CMD ["node", "index.js"]
