FROM node:20-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy all files
COPY . .

# Expose port (Cloud Run uses $PORT)
EXPOSE 8080

# Serve static files on port 8080
CMD ["serve", "-s", ".", "-l", "8080"]
