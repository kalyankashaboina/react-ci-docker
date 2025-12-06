🚀 Docker Setup for Local Development (Vite + React)

This project includes a Docker setup that allows you to run the Vite development server inside a Docker container.

This README explains:

📦 How to build the Docker image

▶️ How to run the app in Docker

⏹️ How to stop the container

🗑️ How to remove containers & images

🔍 Useful Docker commands

📁 Dockerfile (Local Dev)

Your Dockerfile is used to run Vite dev mode inside Docker:

# ------------ Local Development Dockerfile ------------

FROM node:20-alpine

WORKDIR /app

# Copy only package files first (faster caching)

COPY package\*.json ./

# Install dependencies

RUN npm install

# Copy all project files

COPY . .

# Expose the Vite port

EXPOSE 5173

# Run Vite dev server, allow external connections

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

🛠️ 1. Build Docker Image

Run this command from the project root:

docker build -t my-vite-app .

my-vite-app = image name

. = build context (current directory)

▶️ 2. Run the App in Docker
docker run -it -p 5173:5173 --name vite-dev my-vite-app

-p 5173:5173 → exposes Vite dev server

--name vite-dev → container name

my-vite-app → image to run

Now open in browser:

👉 http://localhost:5173

⏹️ 3. Stop the Running Container
docker stop vite-dev

🗑️ 4. Delete the Container
docker rm vite-dev

🧽 5. Delete the Docker Image
docker rmi my-vite-app

📋 Useful Commands
List all containers
docker ps -a

List all images
docker images

Remove all stopped containers
docker container prune

Remove unused images
docker image prune

🔥 Optional: Rebuild and run again
docker build -t my-vite-app .
docker run -it -p 5173:5173 --name vite-dev my-vite-app

🎉 Done!

You now have a complete Docker setup for running your Vite app in development mode.
