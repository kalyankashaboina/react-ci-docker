# Docker for Local Development

Use Docker to run your React + Vite app locally in an isolated environment. Simple and practical for developers.

---

## Prerequisites

- Docker Desktop installed ([https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop))
- Project cloned locally

Check Docker is running:

```bash
docker --version
```

---

## Build the Image

From project root:

```bash
docker build -f Dockerfile -t my-app-dev:latest .
```

This creates a Docker image with Node.js and your app ready to run.

---

## For LOCAL DEV (hot reload, logs visible)

docker run -it -p 5173:5173 my-vite-app

## Run Locally - Interactive Mode (Recommended)

```bash
docker run -it \
  -p 5173:5173 \
  --name my-app-dev \
  --volume $(pwd):/app \
  --volume /app/node_modules \
  my-app-dev:latest
```

**What this does:**

- `-it` → See logs in real-time
- `-p 5173:5173` → Access at `http://localhost:5173`
- `--volume $(pwd):/app` → Code changes auto-reload (hot reload)
- `--volume /app/node_modules` → Keep dependencies in container

Edit files and watch them reload instantly in the browser!

Stop with `Ctrl + C`

---

## Run Locally - Background Mode

```bash
docker run -d \
  -p 5173:5173 \
  --name my-app-dev \
  --volume $(pwd):/app \
  --volume /app/node_modules \
  my-app-dev:latest

# View logs
docker logs -f my-app-dev

# Stop it
docker stop my-app-dev
```

---

## Common Commands

### View Running Containers

```bash
docker ps
```

## View All Containers (running + stopped)

```bash
docker ps -a
```

### View Logs

```bash
docker logs -f my-app-dev       # Follow logs
docker logs --tail 50 my-app-dev  # Last 50 lines
```

### Run Commands Inside Container

```bash
# Run tests
docker exec my-app-dev npm run test

# Run linting
docker exec my-app-dev npm run lint

# Run build
docker exec my-app-dev npm run build
```

## 🧹 Clean Up (Delete Containers & Images)

## 1. Check all containers

```bash
docker ps -a
```

## 2. Remove container (by name OR ID)

```bash
docker stop my-app-dev
docker rm my-app-dev
# or using container ID:
docker rm <container-id>
docker rm <container-id>
```

## 3. Remove the image

```bash
docker rmi my-app-dev:latest
# or using image ID:
docker rmi <image-id>
```

## 4. Remove ALL unused images (optional)

```bash
docker image prune -a
```

## 5. Full cleanup (containers + images + networks)

```bash
docker system prune -a
```

---

## Troubleshooting

### Port 5173 Already in Use

Use a different port:

```bash
docker run -it -p 5174:5173 --name my-app-dev my-app-dev:latest
# Access at http://localhost:5174
```

### Dependencies Not Installing

```bash
# Remove old container
docker stop my-app-dev
docker rm my-app-dev

# Rebuild
docker build -f Dockerfile -t my-app-dev:latest .
docker run -it -p 5173:5173 --name my-app-dev --volume $(pwd):/app --volume /app/node_modules my-app-dev:latest
```

### Can't Access http://localhost:5173

```bash
# Check if container is running
docker ps

# View logs for errors
docker logs my-app-dev
```

---

## Ready for CI/CD?

When you push code, CI/CD will:

1. Build the Docker image
2. Run tests inside the container
3. Push image to registry (if configured)
4. Deploy to production

See `DOCKER-PROD.md` for production image details.
