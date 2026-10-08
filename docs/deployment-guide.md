# Deployment Guide

## Prerequisites

Install:

```bash
docker --version
docker compose version
```

The Docker deployment does not require a separately installed MongoDB or Node.js runtime on the host.

## 1. Clone

```bash
git clone <your-repository-url>
cd mean-stack-example
```

## 2. Validate Configuration

```bash
docker compose config
```

This is a useful first check because it catches malformed Compose YAML before containers are started.

## 3. Build

```bash
docker compose build
```

## 4. Start

```bash
docker compose up -d
```

## 5. Verify

```bash
docker compose ps
```

The expected services are:

```text
mean-client
mean-server
mean-db
```

MongoDB should report a healthy status.

## 6. Test the Frontend

Open:

```text
http://localhost:8080
```

The Employee Management application should load.

## 7. Test the API

```bash
curl http://localhost:5300/healthcheck
```

Expected:

```json
{"status":"ok"}
```

## 8. Test CRUD

Use the application UI to:

1. Create an employee.
2. Verify the employee appears.
3. Edit the employee.
4. Verify the updated values.
5. Delete the employee.
6. Verify the employee is removed.

## 9. Test Persistence

Create or keep an employee record and run:

```bash
docker compose restart
```

Then refresh the application.

The record should remain.

You can also test container recreation:

```bash
docker compose down
docker compose up -d
```

The named `mongo-data` volume should preserve the database.

## 10. Inspect Volumes

```bash
docker volume ls
```

To inspect the Compose volume:

```bash
docker volume inspect <project-name>_mongo-data
```

The exact project prefix depends on the Compose project name.

## 11. Inspect the Network

```bash
docker network ls
```

Then:

```bash
docker network inspect <project-name>_default
```

Again, the exact name depends on the Compose project name.

## 12. View Logs

All services:

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

Specific service:

```bash
docker compose logs -f server
docker compose logs -f client
docker compose logs -f database
```

## 13. Rebuild After Configuration Changes

When Dockerfiles, NGINX configuration, or other image contents change:

```bash
docker compose build
docker compose up -d
```

For a clean rebuild:

```bash
docker compose build --no-cache
docker compose up -d
```

## 14. Stop the Application

```bash
docker compose down
```

This removes containers and the Compose network but keeps the named database volume.

## 15. Full Reset

If you intentionally want to delete the database volume:

```bash
docker compose down -v
```

Then start again:

```bash
docker compose up -d
```

**Warning:** this removes persisted MongoDB data.

## Deployment Checklist

```text
[ ] Docker installed
[ ] docker compose config succeeds
[ ] Images build successfully
[ ] MongoDB becomes healthy
[ ] Server container starts
[ ] Client container starts
[ ] Frontend loads on :8080
[ ] /healthcheck returns status ok
[ ] CRUD works
[ ] Data survives restart
[ ] Data survives compose down/up
```

## Current Deployment Model

```text
Local machine
    │
    └── Docker Compose
          │
          ├── Angular + NGINX
          ├── Node + Express
          └── MongoDB 4.4
```

This is the completed Phase 1 deployment.

The next stage is to reproduce the same application architecture with Kubernetes.
