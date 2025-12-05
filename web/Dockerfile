# Use an official Node.js runtime as the parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies (only production dependencies will be kept in the final image)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' to serve the production build
RUN npm install -g serve

# Expose port that the app runs on
EXPOSE 3000

# Command to serve the build
CMD ["serve", "-s", "build"]
