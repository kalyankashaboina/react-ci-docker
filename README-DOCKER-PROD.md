🚀 Production Docker Setup (React + Vite + Nginx)

This guide explains how to build and run the production-ready Docker image for this React/Vite application using a multi-stage Dockerfile and Nginx.

The final build is:

⚡ Fast (served by Nginx)

📦 Small (thanks to multi-stage build)

🔒 Secure & production-ready

🎯 Uses your vite.prod.config.ts automatically

📁 1. Dockerfile.prod

Your production Dockerfile:

# ------------ STAGE 1: Build the React/Vite app ------------

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package metadata

COPY package\*.json ./

# Install dependencies exactly using package-lock.json

RUN npm ci

# Copy all source code

COPY . .

# Build using Vite production config

RUN npm run build

# Output: /app/dist

# ------------ STAGE 2: Serve app with Nginx ------------

FROM nginx:1.27-alpine

# Remove default nginx site

RUN rm -rf /usr/share/nginx/html/\*

# Copy built frontend from builder stage

COPY --from=builder /app/dist /usr/share/nginx/html

# Uncomment below line if using custom nginx.conf for React Router SPA

# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

📄 2. Optional: nginx.conf (Recommended for React Router)

If your app uses react-router-dom, add this file:

nginx.conf

server {
listen 80;
server*name *;

root /usr/share/nginx/html;
index index.html;

# Forward unknown routes to React SPA

location / {
try_files $uri $uri/ /index.html;
}

# Enable gzip compression

gzip on;
gzip_types text/plain application/javascript text/css application/json image/svg+xml;
gzip_min_length 256;
}

Then enable it in Dockerfile:

COPY nginx.conf /etc/nginx/conf.d/default.conf

🛠️ 3. Build the Production Docker Image

Run this in the project root:

docker build -f Dockerfile.prod -t my-react-app-prod .

-f Dockerfile.prod → tells Docker to use the prod Dockerfile

-t my-react-app-prod → your image name

▶️ 4. Run the Production Container

Start the Nginx server:

docker run -d -p 8080:80 --name my-react-app-prod my-react-app-prod

Now open:

👉 http://localhost:8080

You are now serving the optimized Vite production build.

⏹️ 5. Stop the Production Container
docker stop my-react-app-prod

🗑️ 6. Remove the Container
docker rm my-react-app-prod

🧽 7. Remove the Production Image
docker rmi my-react-app-prod

🗃️ 8. Useful Docker Commands
View all containers
docker ps -a

View all images
docker images

Remove all stopped containers
docker container prune

Remove unused images
docker image prune

📄 9. .dockerignore (Recommended)

Create .dockerignore to speed up builds:

node_modules
dist
.git
.gitignore
Dockerfile
Dockerfile.prod
npm-debug.log\*
.vscode
.husky
coverage

🎉 Done!

Your React + Vite project now has a production-ready Docker workflow using:

Multi-stage builds

Nginx serving

Vite optimized output

SPA-friendly routing

Clean commands for build/run/stop/remove
