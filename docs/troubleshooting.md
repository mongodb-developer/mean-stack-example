# Troubleshooting

## 1. General Diagnostic Sequence

When something fails, start with:

```bash
docker compose ps
docker compose logs
```

Then inspect the specific service:

```bash
docker compose logs client
docker compose logs server
docker compose logs database
```

Check the API:

```bash
curl http://localhost:5300/healthcheck
```

Check the frontend:

```text
http://localhost:8080
```

---

## 2. Frontend Shows "Welcome to nginx!"

This means NGINX is running but the expected Angular `index.html` is not being served.

Inspect the document root:

```bash
docker exec mean-client ls -lah /usr/share/nginx/html
```

The Angular build files should be present.

The current Angular build produces:

```text
index.csr.html
```

The client Dockerfile therefore moves it to:

```text
index.html
```

during the image build.

After changing the Dockerfile, rebuild:

```bash
docker compose build client
docker compose up -d client
```

---

## 3. `/api/healthcheck` Does Not Work

First test the backend directly:

```bash
curl http://localhost:5300/healthcheck
```

If this fails, inspect:

```bash
docker compose logs server
```

If the direct API works but the frontend API does not, inspect the NGINX configuration.

The frontend should proxy:

```text
/api/
```

to:

```text
server:5300
```

---

## 4. Backend Cannot Connect to MongoDB

Check service status:

```bash
docker compose ps
```

MongoDB should be healthy.

Check database logs:

```bash
docker compose logs database
```

Check server logs:

```bash
docker compose logs server
```

The backend should use:

```text
mongodb://database:27017/
```

Do not use:

```text
mongodb://localhost:27017/
```

inside the backend container.

---

## 5. MongoDB Is Not Healthy

Inspect:

```bash
docker compose ps
docker compose logs database
```

The configured healthcheck uses:

```bash
mongo --eval "db.adminCommand('ping')"
```

MongoDB 4.4 must be fully started before the healthcheck can succeed.

---

## 6. Employee Data Disappeared

First check whether the database volume still exists:

```bash
docker volume ls
```

Remember:

```bash
docker compose restart
```

does not delete volumes.

Also:

```bash
docker compose down
docker compose up -d
```

does not delete named volumes.

But:

```bash
docker compose down -v
```

does delete the Compose-managed volumes.

If `down -v` was executed, the previous MongoDB data is expected to be gone.

---

## 7. Port 8080 Already in Use

Check which process is using the port.

On Linux:

```bash
sudo ss -ltnp | grep :8080
```

You can either stop the conflicting process or change the host-side Compose mapping.

For example:

```yaml
ports:
  - "8081:80"
```

Then open:

```text
http://localhost:8081
```

---

## 8. Port 5300 Already in Use

Check:

```bash
sudo ss -ltnp | grep :5300
```

Stop the conflicting process or change the host-side port mapping.

The container can continue listening on:

```text
5300
```

while a different host port is published.

---

## 9. Docker Build Fails

Start with:

```bash
docker compose build
```

Read the first meaningful error rather than only the final error line.

For the client:

```bash
docker compose build client
```

For the server:

```bash
docker compose build server
```

For a completely fresh build:

```bash
docker compose build --no-cache
```

---

## 10. Inspect Container Files

Client:

```bash
docker exec -it mean-client sh
```

Then:

```bash
ls -lah /usr/share/nginx/html
```

Server:

```bash
docker exec -it mean-server sh
```

Then:

```bash
ls -lah /app
```

---

## 11. Check NGINX Configuration

Enter the client container:

```bash
docker exec -it mean-client sh
```

Then:

```bash
nginx -t
```

A successful configuration test should report that the syntax is valid.

---

## 12. Angular Route Returns 404

The NGINX configuration uses:

```nginx
try_files $uri $uri/ /index.html;
```

This allows Angular client-side routes to fall back to the main application entry point.

If Angular routes return NGINX 404 errors, verify that the custom NGINX configuration is actually being copied into:

```text
/etc/nginx/nginx.conf
```

---

## 13. API Requests Return 404

Verify the backend route:

```text
/employees
```

The frontend-facing route is:

```text
/api/employees
```

NGINX removes the `/api/` prefix before forwarding.

Therefore:

```text
/api/employees
```

becomes:

```text
/employees
```

inside the backend.

---

## 14. Useful One-Line Checks

Container status:

```bash
docker compose ps
```

API:

```bash
curl http://localhost:5300/healthcheck
```

All logs:

```bash
docker compose logs --tail=100
```

Database logs:

```bash
docker compose logs --tail=100 database
```

Server logs:

```bash
docker compose logs --tail=100 server
```

Client logs:

```bash
docker compose logs --tail=100 client
```

---

## Troubleshooting Principle

Diagnose the system layer by layer:

```text
Docker
  ↓
Container
  ↓
Service
  ↓
Network
  ↓
Application
  ↓
Database
```

Do not immediately rebuild everything. First identify which layer is actually failing.
