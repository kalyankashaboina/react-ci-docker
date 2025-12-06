# Docker for Production

Build and run your React + Vite app in production using a multi-stage Docker build. This creates a small, optimized image with Nginx serving your compiled app.

---

## How It Works

**Two stages:**

1. **Build stage:** Use Node.js to compile your app → creates `/dist`
2. **Runtime stage:** Use Nginx to serve `/dist` → final image is ~50MB

The build tools are discarded, so your final image is tiny and production-ready.

---

## Build the Production Image

```bash
docker build -f Dockerfile.prod -t my-app-prod:latest .
```

This builds your app and creates the production image.

---

## For PRODUCTION (built files, no dev logs)

docker run -it -p 80:80 my-vite-app

## Run the Container

```bash
docker run -d \
  --name my-app-prod \
  -p 80:80 \
  --restart unless-stopped \
  my-app-prod:latest
```

**What this does:**

- `-d` → Run in background
- `-p 80:80` → Serve on port 80 (HTTP)
- `--restart unless-stopped` → Auto-restart if it crashes

Access your app at: `http://localhost`

### With Environment Variables

```bash
docker run -d \
  --name my-app-prod \
  -p 80:80 \
  --env VITE_API_BASE_URL=https://api.example.com \
  --restart unless-stopped \
  my-app-prod:latest
```

---

## Common Commands

### View Running Container

```bash
docker ps
```

### View Logs

```bash
docker logs -f my-app-prod
```

### Stop Container

```bash
docker stop my-app-prod
```

### Clean Up

```bash
docker stop my-app-prod
docker rm my-app-prod
docker rmi my-app-prod:latest
```

---

## Troubleshooting

### Container Exits Immediately

```bash
# Check logs
docker logs my-app-prod

# Common causes:
# 1. Nginx config error → Check nginx.conf
# 2. Port already in use → Use different port
# 3. Out of memory → Increase Docker memory
```

### Can't Access the App

```bash
# Verify container is running
docker ps

# Check logs
docker logs my-app-prod

# Try connecting inside container
docker exec my-app-prod curl http://localhost
```

---

## Optional: Nginx Configuration

If your app uses React Router, create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Forward unknown routes to React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain application/javascript text/css application/json image/svg+xml;
}
```

Then in `Dockerfile.prod`, uncomment:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## For CI/CD Pipeline

When you push code:

1. GitHub Actions builds this image
2. Runs tests inside the container
3. Pushes image to registry
4. Deploys to production server

Your job is just to make sure:

- The app builds: `npm run build`
- Tests pass: `npm run test`
- Docker builds: `docker build -f Dockerfile.prod -t my-app:latest .`
