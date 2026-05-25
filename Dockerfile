FROM node:22-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY server/package.json server/package-lock.json ./
RUN npm ci

# Copy the server directory
COPY server/ ./

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
