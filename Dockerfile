# Use the official Node.js image with Alpine Linux version 20 as base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]