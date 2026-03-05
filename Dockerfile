# Use Node.js LTS (Long Term Support) as base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the frontend
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
