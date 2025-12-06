# Docker Development & Orchestration Guide

This guide explains how to run your scalable React + Vite application in Docker containers for development and how to orchestrate multiple services using Docker Compose. This ensures consistency across all environments (DRY principle) and enables efficient local testing of distributed systems.

---

## 📋 Quick Links

- [Prerequisites](#prerequisites)
- [Build Development Image](#build-development-image)
- [Run Development Container](#run-development-container)
- [Docker Compose Setup](#docker-compose-setup)
- [Hot Module Replacement](#hot-module-replacement)
- [Orchestration for Microservices](#orchestration-for-microservices)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker Desktop installed ([https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop))
- 4GB+ available RAM and disk space
- Project repository cloned locally

**Verify Docker installation:**

```bash
docker --version      # Should show v20+
docker run hello-world # Should succeed
```

---

## Build Development Image

From the project root, build the development image:

```bash
docker build -f Dockerfile -t my-app-dev:latest .
```

**What happens:**

1. Base image: `node:20-alpine` (minimal, fast)
2. Working directory: `/app`
3. Copy `package*.json` for dependency caching
4. Run `npm install`
5. Copy source code
6. Expose port `5173` (Vite dev server)
7. Start dev server with `npm run dev --host 0.0.0.0`

**Build output:**

```
Successfully built abc123def456
Successfully tagged my-app-dev:latest
```

---

## Run Development Container

### Option 1: Interactive Mode (Recommended for Development)

```bash
docker run -it \
  -p 5173:5173 \
  --name my-app-dev \
  --volume $(pwd):/app \
  --volume /app/node_modules \
  my-app-dev:latest
```

**Flags:**

| Flag                         | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `-it`                        | Interactive terminal - see logs in real-time |
| `-p 5173:5173`               | Map container port → host port               |
| `--name my-app-dev`          | Container name (easy reference)              |
| `--volume $(pwd):/app`       | Mount source code (hot reload)               |
| `--volume /app/node_modules` | Preserve node_modules in container           |

**Access app at:** `http://localhost:5173`

**Stop container:** `Ctrl + C`

### Option 2: Detached Mode (Background Execution)

```bash
docker run -d \
  -p 5173:5173 \
  --name my-app-dev \
  --volume $(pwd):/app \
  --volume /app/node_modules \
  my-app-dev:latest

# View logs
docker logs -f my-app-dev

# Stop container
docker stop my-app-dev
```

---

## Hot Module Replacement

With volume mount (`--volume $(pwd):/app`), changes instantly reload in the browser:

```bash
# 1. Modify: src/components/Button/Button.tsx
# 2. Save file
# 3. Browser automatically refreshes ✨
```

This provides **fast development feedback loop** without container restart.

---

## Docker Compose Setup

### Multi-Service Orchestration

For local development with API backend, database, and caching:

```yaml
# docker-compose.yml
version: '3.8'

services:
  # React Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '5173:5173'
    environment:
      VITE_API_BASE_URL: http://api:3000/api
      VITE_ENABLE_DEBUG_MODE: 'true'
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - api
    networks:
      - app-network
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:5173']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

  # Node.js API Backend
  api:
    image: node:20-alpine
    working_dir: /app
    command: npm run dev
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://user:password@db:5432/app_dev
      REDIS_URL: redis://cache:6379
    volumes:
      - ../api:/app
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app-network

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Redis Cache
  cache:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**Run the entire stack:**

```bash
# Start all services
docker-compose up

# Or in detached mode
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove data
docker-compose down -v
```

### Docker Compose Commands

```bash
# Build custom images
docker-compose build

# Rebuild specific service
docker-compose build frontend

# View running services
docker-compose ps

# Execute command in service
docker-compose exec frontend npm run lint

# Scale service (run multiple instances)
docker-compose up -d --scale api=3

# View service logs
docker-compose logs -f api

# View logs for last N lines
docker-compose logs --tail 50 api
```

---

## Orchestration for Microservices

### Development with Multiple Microservices

For projects with independent microservices, create separate docker-compose files:

```
├── frontend/
│   ├── Dockerfile
│   └── docker-compose.yml
├── auth-service/
│   ├── Dockerfile
│   └── docker-compose.yml
├── product-service/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docker-compose.shared.yml    # Shared services (DB, Cache)
└── docker-compose.full.yml      # Orchestrate all services
```

**docker-compose.full.yml (Orchestrate everything):**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - '5173:5173'
    environment:
      VITE_API_GATEWAY: http://api-gateway:8080
    networks:
      - backend

  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    ports:
      - '8080:8080'
    depends_on:
      - auth-service
      - product-service
    networks:
      - backend

  auth-service:
    build:
      context: ./auth-service
      dockerfile: Dockerfile
    ports:
      - '3001:3000'
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/auth
    depends_on:
      db:
        condition: service_healthy
    networks:
      - backend

  product-service:
    build:
      context: ./product-service
      dockerfile: Dockerfile
    ports:
      - '3002:3000'
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/products
    depends_on:
      db:
        condition: service_healthy
    networks:
      - backend

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_INITDB_ARGS: '--encoding=UTF8'
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  cache:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    networks:
      - backend

volumes:
  postgres-data:

networks:
  backend:
    driver: bridge
```

**Start all services:**

```bash
docker-compose -f docker-compose.full.yml up -d

# View status
docker-compose -f docker-compose.full.yml ps

# Tail all logs
docker-compose -f docker-compose.full.yml logs -f
```

### Service Discovery

Services communicate within the Docker network by hostname:

```typescript
// Frontend calls API Gateway
const API_BASE_URL = 'http://api-gateway:8080/api';

// API Gateway calls microservices
const AUTH_SERVICE = 'http://auth-service:3000';
const PRODUCT_SERVICE = 'http://product-service:3000';
```

---

## Scaling & Load Balancing

### Scale Services Horizontally

```bash
# Run 3 instances of API service
docker-compose up -d --scale api=3

# View all running instances
docker-compose ps

# Load balancer (nginx) distributes traffic
```

**Load Balancer Config (nginx):**

```nginx
upstream api {
    server api:3000;
    server api:3000;
    server api:3000;
}

server {
    listen 8080;

    location /api/ {
        proxy_pass http://api/;
    }
}
```

### Monitoring Services

```bash
# Monitor resource usage
docker stats

# View service health
docker-compose ps

# Check service logs for errors
docker-compose logs --tail 100 api | grep ERROR
```

---

##

### View Running Containers

```bash
docker ps                    # Running containers
docker ps -a                 # All containers (including stopped)
```

### View Container Logs

```bash
docker logs my-app-dev       # Show all logs
docker logs -f my-app-dev    # Follow logs in real-time
docker logs --tail 50 my-app-dev  # Last 50 lines
```

### Execute Commands in Container

```bash
# Run lint check
docker exec my-app-dev npm run lint

# Run tests
docker exec my-app-dev npm run test

# Run tests with coverage
docker exec my-app-dev npm run test:coverage
```

### Clean Up

```bash
# Stop container
docker stop my-app-dev

# Remove container
docker rm my-app-dev

# Remove image
docker rmi my-app-dev:latest

# Remove all unused images
docker image prune -a
```

---

## Environment Variables in Docker

### Using .env.local

```bash
# 1. Create .env.local in project root
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
EOF

# 2. Container automatically reads .env.local
docker run -it -p 5173:5173 -v $(pwd):/app my-app-dev:latest
```

### Using --env Flag

```bash
docker run -it \
  -p 5173:5173 \
  --env VITE_API_BASE_URL=http://api.example.com \
  --env VITE_ENABLE_ANALYTICS=true \
  my-app-dev:latest
```

---

## Troubleshooting

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5173`

**Solution:**

```bash
# Use different port
docker run -it -p 5174:5173 my-app-dev:latest
# Access at: http://localhost:5174

# Or find and stop process using port 5173
lsof -i :5173
kill -9 <PID>
```

### node_modules Not Updating

**Error:** Dependencies not installing after `package.json` change

**Solution:**

```bash
# Remove old container and volume
docker stop my-app-dev
docker rm my-app-dev

# Rebuild image
docker build -f Dockerfile -t my-app-dev:latest .

# Run with clean node_modules
docker run -it -p 5173:5173 -v $(pwd):/app my-app-dev:latest
```

### Cannot Connect to Container

**Error:** `http://localhost:5173` not accessible

**Solution:**

```bash
# Verify container is running
docker ps

# Check if port is actually exposed
docker port my-app-dev

# View container logs for errors
docker logs my-app-dev

# Try 0.0.0.0 explicitly
docker run -it -p 0.0.0.0:5173:5173 my-app-dev:latest
```

### Permission Denied on Volume

**Error:** `permission denied while trying to connect to Docker daemon`

**Solution (Linux):**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Relogin or restart Docker service
newgrp docker
# or
sudo systemctl restart docker
```

---

## Next Steps

- **Production Build:** See [README-DOCKER-PROD.md](./README-DOCKER-PROD.md) for production deployment
- **Docker Compose:** See [DOCKER.md](./DOCKER.md) for multi-service setup
- **CI/CD Integration:** See [SDLC-STANDARDS.md](./SDLC-STANDARDS.md#deployment--devops) for automated deployments

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
