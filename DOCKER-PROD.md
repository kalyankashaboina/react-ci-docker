# Docker Production Guide

This guide explains how to build and deploy a production-ready Docker image for your scalable React + Vite application using multi-stage builds and Nginx for optimal performance.

---

## 📋 Quick Links

- [Architecture Overview](#architecture-overview)
- [Multi-Stage Build Process](#multi-stage-build-process)
- [Build Production Image](#build-production-image)
- [Run Production Container](#run-production-container)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)
- [Deployment Strategies](#deployment-strategies)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

**Production setup uses:**

✅ **Multi-stage Docker build** - Optimized image size  
✅ **Nginx** - High-performance web server  
✅ **Alpine Linux** - Minimal base image  
✅ **Environment configuration** - Flexible deployment  
✅ **Health checks** - Container monitoring

**Benefits:**

| Aspect           | Benefit                                        |
| ---------------- | ---------------------------------------------- |
| **Build Size**   | ~50MB (vs 400MB+ without multi-stage)          |
| **Performance**  | Nginx serves static files at ~10K req/sec      |
| **Security**     | No Node.js in production, minimal surface area |
| **Scalability**  | Easily replicate across multiple servers       |
| **DevOps Ready** | Works with Kubernetes, Docker Compose, Swarm   |

---

## Multi-Stage Build Process

### Stage 1: Build

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Output: /app/dist
```

**Why multi-stage?**

- Stage 1 produces `/dist` folder (built app)
- Stage 1 environment (Node.js, npm) is discarded
- Final image only contains: Nginx + `/dist`
- Result: 80-90% smaller image ✨

### Stage 2: Production Runtime

```dockerfile
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Why Nginx?**

- Lightweight web server
- Serves static files efficiently
- Handles caching, compression, routing
- ~15MB total image size

---

## Build Production Image

From project root:

```bash
docker build -f Dockerfile.prod -t my-app-prod:latest .
```

**Build process:**

```
[Stage 1] Building Node.js environment...
→ Install dependencies (npm ci)
→ Compile TypeScript
→ Bundle with Vite (vite.prod.config.ts)
→ Generate optimized dist/

[Stage 2] Creating Nginx container...
→ Copy dist/ to Nginx
→ Configure Nginx
→ Discard Node.js environment

✅ Final image: my-app-prod:latest (~50MB)
```

**Verify image:**

```bash
docker images | grep my-app-prod
# REPOSITORY    TAG       SIZE
# my-app-prod   latest    52MB
```

---

## Run Production Container

### Single Container Deployment

```bash
docker run -d \
  --name my-app-prod \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  my-app-prod:latest
```

**Flags:**

| Flag                       | Purpose                           |
| -------------------------- | --------------------------------- |
| `-d`                       | Detached mode (background)        |
| `--name my-app-prod`       | Container name                    |
| `-p 80:80`                 | HTTP traffic                      |
| `-p 443:443`               | HTTPS traffic (if SSL configured) |
| `--restart unless-stopped` | Auto-restart on failure           |

**Access app:** `http://localhost` or `http://your-domain.com`

### With Environment Configuration

```bash
docker run -d \
  --name my-app-prod \
  -p 80:80 \
  --env VITE_API_BASE_URL=https://api.example.com \
  --restart unless-stopped \
  my-app-prod:latest
```

### Container Health Check

```bash
docker ps
# Check STATUS column - should show: Up X seconds (healthy)

docker exec my-app-prod curl http://localhost
# Should return HTML of your app
```

---

## Performance Optimization

### Enable Gzip Compression

**nginx.conf:**

```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
gzip_comp_level 5;
```

**Result:** 60-70% reduction in response size

### Configure Caching

```nginx
# Cache static assets for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Don't cache HTML (always fetch fresh)
location ~* \.html?$ {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### CDN Integration

For global performance, use a CDN (Cloudflare, AWS CloudFront, etc.):

```bash
# Your origin server
docker run -d -p 5000:80 my-app-prod:latest

# CDN routes global traffic → your origin
# User → CDN (fast edge servers) → Your origin (if not cached)
```

---

## Security Best Practices

### 1. Use Non-Root User in Dockerfile

```dockerfile
FROM nginx:1.27-alpine

# Create non-root user
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx \
    -s /sbin/nologin -G nginx -g nginx nginx

# ... rest of Dockerfile
```

### 2. Use HTTPS/SSL

```bash
# With SSL certificates
docker run -d \
  --name my-app-prod \
  -p 80:80 \
  -p 443:443 \
  -v /path/to/ssl:/etc/nginx/ssl:ro \
  my-app-prod:latest
```

**nginx.conf:**

```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Redirect HTTP → HTTPS
}

server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

### 3. Environment Variable Security

**DON'T commit secrets:**

```bash
# ❌ BAD - Don't do this
VITE_API_KEY=secret123  # In .env

# ✅ GOOD - Use secrets management
docker run -d \
  --secret api_key \
  my-app-prod:latest
```

### 4. Image Scanning

```bash
# Scan for vulnerabilities
docker scan my-app-prod:latest

# Use minimal base images
FROM nginx:1.27-alpine  # ✅ Small attack surface
FROM nginx:1.27        # ❌ Large, more vulnerabilities
```

---

## Deployment Strategies for Scale

### Strategy 1: Single Server (1-100K users)

**Architecture:**

```
Users → Nginx (reverse proxy) → Docker Container
```

**Setup:**

```bash
docker build -f Dockerfile.prod -t my-app:v1.0 .
docker tag my-app:v1.0 myregistry.com/my-app:v1.0
docker push myregistry.com/my-app:v1.0

# Deploy
docker run -d \
  --name my-app \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  --health-cmd='curl -f http://localhost || exit 1' \
  --health-interval=30s \
  myregistry.com/my-app:v1.0
```

**Scaling to 100K+ users:** Add load balancer in front

### Strategy 2: Docker Compose (Multiple Services, 100K-1M users)

**Architecture:**

```
Users → Load Balancer → Frontend Containers (3+)
                     → API Containers (3+)
                     → Database (Managed)
                     → Cache (Managed)
```

**docker-compose.prod.yml:**

```yaml
version: '3.8'

services:
  # Frontend (x3 instances)
  frontend:
    image: myregistry.com/my-app:v1.0
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    ports:
      - '80:80'
    environment:
      NODE_ENV: production
      VITE_API_BASE_URL: https://api.example.com
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - prod-network

  # API Backend (x3 instances)
  api:
    image: myregistry.com/api:v1.0
    deploy:
      replicas: 3
    environment:
      DATABASE_URL: postgres://user:pass@db-managed:5432/app
      REDIS_URL: redis://cache-managed:6379
      NODE_ENV: production
    depends_on:
      - db
    networks:
      - prod-network

  # Database (single instance, managed)
  db:
    image: postgres:15-alpine
    volumes:
      - db-prod:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    networks:
      - prod-network

  # Cache (single instance)
  cache:
    image: redis:7-alpine
    volumes:
      - cache-prod:/data
    networks:
      - prod-network

  # Load Balancer (Nginx)
  lb:
    image: nginx:1.27-alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
    networks:
      - prod-network

volumes:
  db-prod:
  cache-prod:

networks:
  prod-network:
    driver: bridge
```

**Deploy:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Strategy 3: Kubernetes (Enterprise Scale, 1M+ users)

**Architecture:**

```
Users → CDN → Ingress Controller
           → Frontend Pods (x5-10)
           → API Pods (x5-10)
           → StatefulSet Database
           → Cache Cluster
           → Load Balancer
```

**Kubernetes Deployment:**

```yaml
# k8s-frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-frontend
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: my-app-frontend
      tier: frontend
  template:
    metadata:
      labels:
        app: my-app-frontend
        tier: frontend
    spec:
      containers:
        - name: frontend
          image: myregistry.com/my-app:v1.0
          ports:
            - containerPort: 80
          env:
            - name: VITE_API_BASE_URL
              value: https://api.example.com
          resources:
            requests:
              memory: '64Mi'
              cpu: '100m'
            limits:
              memory: '256Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - my-app-frontend
                topologyKey: kubernetes.io/hostname
---
# k8s-frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-frontend
  namespace: production
spec:
  selector:
    app: my-app-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
---
# k8s-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - example.com
        - www.example.com
      secretName: my-app-tls
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app-frontend
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app-api
                port:
                  number: 3000
```

**Deploy to Kubernetes:**

```bash
kubectl apply -f k8s-frontend-deployment.yaml
kubectl apply -f k8s-frontend-service.yaml
kubectl apply -f k8s-ingress.yaml

# Monitor
kubectl get pods -n production
kubectl logs -f deployment/my-app-frontend -n production
```

### Strategy 4: Multi-Region Deployment (Global Scale, 10M+ users)

**Architecture:**

```
Global Users ↓
    CDN (Cloudflare, CloudFront)
    ↓
  Region 1 (US)     Region 2 (EU)     Region 3 (APAC)
  [K8s Cluster]     [K8s Cluster]     [K8s Cluster]
  └─ App Pods       └─ App Pods       └─ App Pods
  └─ Cache          └─ Cache          └─ Cache
  └─ DB (Read)      └─ DB (Read)      └─ DB (Read)
           ↓              ↓                  ↓
        Global Database Replication ←→ Conflict Resolution
```

**Benefits:**

- Lower latency (users connect to nearest region)
- High availability (single region failure doesn't impact others)
- Compliance (data residency requirements)
- Scalability (horizontal scaling across regions)

**Implementation:**

```bash
# Deploy to each region
for REGION in us-east eu-west ap-southeast; do
  kubectl --context=k8s-$REGION apply -f k8s-frontend-deployment.yaml
  kubectl --context=k8s-$REGION apply -f k8s-api-deployment.yaml
done

# Setup DNS failover (Route 53, CloudFlare)
# Setup database replication
# Monitor across regions
```

---

## Scaling Checklist

| Phase  | Users    | Infrastructure          | Priority          |
| ------ | -------- | ----------------------- | ----------------- |
| **V1** | 0-10K    | Single server + CDN     | Setup monitoring  |
| **V2** | 10K-100K | Docker Compose + LB     | Add caching layer |
| **V3** | 100K-1M  | Kubernetes + Managed DB | Add multi-region  |
| **V4** | 1M+      | Multi-region K8s        | Global CDN + DDoS |

---

## Troubleshooting

### Container Exits Immediately

```bash
# Check logs
docker logs my-app-prod

# Common causes:
# 1. Nginx config error → Fix nginx.conf
# 2. Port already in use → Use different port
# 3. Out of memory → Increase Docker memory
```

### 502 Bad Gateway

**Cause:** Nginx can't reach application

**Solution:**

```bash
# Verify app is running
docker exec my-app-prod curl http://localhost
```

### Slow Performance

**Optimization:**

```bash
# Enable HTTP/2
server {
    listen 443 ssl http2;
    # ...
}

# Enable caching headers (nginx.conf)
add_header X-Cache-Status $upstream_cache_status;
```

### Large Image Size

**Reduce image:**

```dockerfile
# Use smaller base
FROM node:20-alpine    # ✅ ~150MB
FROM node:20           # ❌ ~900MB

# Remove unnecessary files
RUN npm ci --only=production
RUN npm cache clean --force
```

---

## 📊 Monitoring, Logging & Observability

### Application Performance Monitoring (APM)

**Recommended Tools:**

| Tool          | Purpose                   | Cost             | Setup  |
| ------------- | ------------------------- | ---------------- | ------ |
| **Sentry**    | Error tracking & alerting | Free tier + paid | 5 min  |
| **DataDog**   | Infrastructure & APM      | Paid             | 15 min |
| **New Relic** | Full stack observability  | Paid             | 10 min |
| **Grafana**   | Dashboards & metrics      | Open source      | 30 min |
| **ELK Stack** | Logging & analytics       | Open source      | 1 hour |

**Basic APM Setup (Sentry):**

```bash
# 1. Install Sentry SDK
npm install @sentry/react @sentry/tracing

# 2. Initialize in src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

# 3. Monitor in Docker
docker run -d \
  -e VITE_SENTRY_DSN=https://xxx@sentry.io/123 \
  my-app-prod:latest
```

### Container Monitoring

```bash
# Real-time resource usage
docker stats

# Monitor all containers
watch -n 1 'docker stats --no-stream'

# Alert on high CPU
docker stats --format "{{.Container}}: {{.CPUPerc}}"
```

### Log Aggregation

**ELK Stack Setup (Docker Compose):**

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - '9200:9200'
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - '5601:5601'
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - '5000:5000'
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

**Access Kibana:** `http://localhost:5601`

### Health Checks & Alerting

**Uptime Monitoring:**

```bash
# Add to production docker-compose
services:
  app:
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Alert Escalation:**

- P1 (Critical): Page on-call immediately
- P2 (High): Send urgent notification
- P3 (Medium): Create ticket
- P4 (Low): Log for weekly review

---

## 🔐 Production Hardening Checklist

| Category        | Requirement                  | Status |
| --------------- | ---------------------------- | ------ |
| **Security**    | HTTPS/TLS enabled            | - [ ]  |
|                 | Non-root container user      | - [ ]  |
|                 | Secrets in environment vars  | - [ ]  |
|                 | Regular security scanning    | - [ ]  |
| **Performance** | Gzip compression enabled     | - [ ]  |
|                 | Cache headers configured     | - [ ]  |
|                 | CDN in front                 | - [ ]  |
|                 | Image optimization done      | - [ ]  |
| **Reliability** | Health checks configured     | - [ ]  |
|                 | Auto-restart on failure      | - [ ]  |
|                 | Monitoring/alerting set      | - [ ]  |
|                 | Disaster recovery plan       | - [ ]  |
| **Compliance**  | Privacy policy linked        | - [ ]  |
|                 | GDPR compliant (if EU users) | - [ ]  |
|                 | Audit logging enabled        | - [ ]  |
|                 | Regular backups              | - [ ]  |

---

## 📈 Performance Benchmarks

**Target Metrics:**

| Metric                       | Target    | Tool              |
| ---------------------------- | --------- | ----------------- |
| **Time to First Byte**       | <500ms    | Lighthouse        |
| **First Contentful Paint**   | <2s       | Core Web Vitals   |
| **Largest Contentful Paint** | <2.5s     | Core Web Vitals   |
| **Cumulative Layout Shift**  | <0.1      | Core Web Vitals   |
| **Requests per second**      | >1000 rps | Apache Bench      |
| **P95 Response Time**        | <200ms    | Custom monitoring |
| **Error Rate**               | <0.1%     | APM tools         |

**Load Testing:**

```bash
# Install Apache Bench
brew install httpd

# Run load test
ab -n 10000 -c 100 https://example.com/

# Results show:
# Requests per second: X
# Time per request: Y ms
# Failed requests: Z
```

---

## 💰 Cost Optimization

### Reduce Container Size

**Before:**

```dockerfile
FROM node:20
COPY . .
RUN npm install
RUN npm run build
EXPOSE 80
```

→ **~900MB**

**After (multi-stage):**

```dockerfile
FROM node:20-alpine AS builder
COPY . .
RUN npm ci && npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

→ **~50MB** ✅ **95% reduction**

### Infrastructure Costs

| Strategy          | Server       | Monthly | Pros              | Cons        |
| ----------------- | ------------ | ------- | ----------------- | ----------- |
| **Single Server** | 1x $20       | $20     | Cheap             | No HA       |
| **Managed K8s**   | 3x $100      | $300    | Scalable, HA      | Complex     |
| **Serverless**    | -            | $5-50   | Cheap, Auto-scale | Cold starts |
| **CDN + Origin**  | 1x $20 + CDN | $50-100 | Global, Fast      | CDN costs   |

### Right-sizing Resources

```yaml
# Wrong: Over-provisioned
resources:
  requests:
    memory: '512Mi'
    cpu: '1000m'
  limits:
    memory: '1Gi'
    cpu: '2000m'

# Right: Optimized
resources:
  requests:
    memory: '64Mi'
    cpu: '100m'
  limits:
    memory: '256Mi'
    cpu: '500m'
```

**Result:** 5-10x cost savings with proper monitoring

---

## Next Steps

- **Development:** See [README-DOCKER.md](./README-DOCKER.md) for local development
- **Docker Compose:** See [DOCKER.md](./DOCKER.md) for multi-service orchestration
- **CI/CD:** See [SDLC-STANDARDS.md](./SDLC-STANDARDS.md#deployment--devops) for automated deployments
- **Monitoring:** Set up application performance monitoring (APM)

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
