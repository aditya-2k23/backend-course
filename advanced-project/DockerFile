# Docker Instruction Sheet
# Use official node.js runtime as a parent image.
# Here image refers not to a picture but to a container, basically a snapshot of that container.

FROM node:22-alpine

# Set the working directory in the container to /app.
WORKDIR /app

# Copy the package.json and package-lock.json files to the container at /app.
COPY package*.json .

# Install the dependencies.
RUN npm install

# Copy the rest of the application code to the container at /app.
COPY . .

# Expose the port the app runs on.
EXPOSE 5000

# Define the command to run the application when the container starts.
CMD ["node", "./src/server.js"]
