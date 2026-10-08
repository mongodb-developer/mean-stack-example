# MEAN Stack Example: Employee Records App

A full-stack employee management application built with the **MEAN stack** — MongoDB, Express, Angular, and Node.js.

This repository started from the original MEAN Stack Example application and has been extended as a practical **DevOps learning project**. The application is now containerized with Docker Compose, with Kubernetes and AWS/EKS planned as the next stages.

> **Current focus:** Phase 1 — Docker Compose deployment

---

## Project Overview

The application provides a simple employee record management system with full CRUD operations:

- Create employee records
- Read employee records
- Update employee records
- Delete employee records

The Angular frontend communicates with a Node.js/Express API, while employee data is stored in MongoDB.

The original application architecture was:

```text
Angular Frontend → Express API → MongoDB
```

The current Dockerized architecture is:

```text
                    ┌─────────────────────────┐
                    │       Browser            │
                    │     localhost:8080       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Angular + NGINX       │
                    │      mean-client        │
                    │        :80              │
                    └────────────┬────────────┘
                                 │ /api/
                                 ▼
                    ┌─────────────────────────┐
                    │   Node.js + Express      │
                    │      mean-server        │
                    │        :5300            │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       MongoDB 4.4        │
                    │        mean-db           │
                    │        :27017            │
                    └─────────────────────────┘
```

---

## Current Project Status

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Completed | Docker + Docker Compose |
| Phase 2 | 🚧 Planned | Kubernetes deployment |
| Phase 3 | ⏳ Planned | Advanced Kubernetes |
| Phase 4 | ⏳ Planned | AWS / EKS deployment |

---

## Tech Stack

### Application

- **Frontend:** Angular
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB
- **API:** REST / JSON

### DevOps

- Docker
- Docker Compose
- NGINX
- Multi-stage Docker builds
- Docker healthcheck
- Named Docker volume
- Docker network / service discovery

### Planned

- Kubernetes
- Ingress
- ConfigMaps / Secrets
- Probes
- HPA
- RBAC
- NetworkPolicy
- CI/CD
- AWS EKS

---

## Project Structure

```text
mean-stack-example/
│
├── .github/
│   ├── CODEOWNERS
│   └── workflows/
│       └── ci.yml
│
├── client/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   └── ...
│
├── server/
│   ├── src/
│   ├── scripts/
│   ├── tests/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── ...
│
├── docs/
│   ├── architecture.md
│   ├── deployment-guide.md
│   └── troubleshooting.md
│
├── docker-compose.yml
├── README.md
├── LICENSE
├── NOTICE
└── .gitignore

```

---

# Docker Deployment

## Docker Compose Services

The application is split into three containers:

| Service | Container | Purpose | Port |
|---|---|---|---|
| `client` | `mean-client` | Angular + NGINX | `8080 → 80` |
| `server` | `mean-server` | Express API | `5300 → 5300` |
| `database` | `mean-db` | MongoDB | internal `27017` |

MongoDB is intentionally **not published to the host**. The backend reaches it through the Docker Compose service name:

```text
mongodb://database:27017/
```

Docker's internal DNS resolves `database` to the MongoDB container.

---

## Why NGINX Is Used

The Angular application is built into static production files and served by NGINX.

NGINX also acts as a reverse proxy for the backend API.

For example:

```text
Browser
   │
   ├── /              → Angular application
   │
   └── /api/employees → NGINX
                           │
                           ▼
                     mean-server:5300
                           │
                           ▼
                        MongoDB
```

The `/api/` prefix is removed by the NGINX proxy configuration before the request reaches Express.

Therefore:

```text
/api/employees
```

is forwarded internally as:

```text
/employees
```

which matches the backend route.

---

# Quick Start

## Prerequisites

Install:

- Docker
- Docker Compose plugin

Verify:

```bash
docker --version
docker compose version
```

No local Node.js or MongoDB installation is required for the Docker deployment.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Shivam-Infra-Labs/mean-stack-example
cd mean-stack-example
```

---

## 2. Validate the Compose Configuration

Before starting the application:

```bash
docker compose config
```

If the configuration is valid, Docker Compose will render the final configuration without errors.

---

## 3. Build the Images

```bash
docker compose build
```

This builds:

- Angular + NGINX image
- Node.js + Express image

MongoDB uses the official `mongo:4.4` image.

---

## 4. Start the Application

```bash
docker compose up -d
```

Check the containers:

```bash
docker compose ps
```

Expected services:

```text
mean-client
mean-server
mean-db
```

---

## 5. Open the Application

Open:

```text
http://localhost:8080
```

The Employee Management application should be available.

---

# Health Check

The backend exposes:

```text
GET /healthcheck
```

From the host:

```bash
curl http://localhost:5300/healthcheck
```

Expected response:

```json
{"status":"ok"}
```

The MongoDB container also has a Docker healthcheck using:

```bash
mongo --eval "db.adminCommand('ping')"
```

The backend waits for MongoDB to become healthy before starting.

---

# REST API

Backend base URL:

```text
http://localhost:5300
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/healthcheck` | Check API health |
| `GET` | `/employees` | Retrieve all employees |
| `GET` | `/employees/:id` | Retrieve one employee |
| `POST` | `/employees` | Create an employee |
| `PUT` | `/employees/:id` | Update an employee |
| `DELETE` | `/employees/:id` | Delete an employee |

Through the frontend NGINX proxy, API requests use:

```text
/api/employees
```

Example request body:

```json
{
  "name": "Jane Smith",
  "position": "Developer",
  "level": "senior"
}
```

Supported levels:

```text
junior
mid
senior
```

---

# Database

The backend connects to MongoDB using the Docker service name:

```text
mongodb://database:27017/
```

The application uses:

```text
Database: meanStackExample
Collection: employees
```

The database uses a named Docker volume:

```text
mongo-data
```

This means MongoDB data survives normal container recreation.

For example:

```bash
docker compose down
docker compose up -d
```

does **not** remove the named volume.

To remove the database volume intentionally:

```bash
docker compose down -v
```

> **Warning:** `docker compose down -v` deletes the Compose-managed database volume and therefore removes the stored MongoDB data.

---

# Docker Architecture

## Container Communication

The services communicate over the Docker Compose network.

```text
mean-client
     │
     │ HTTP
     ▼
mean-server:5300
     │
     │ MongoDB protocol
     ▼
database:27017
```

Containers should use Docker service names for internal communication rather than `localhost`.

For example, inside the backend container:

```text
database:27017
```

is correct.

This would be incorrect:

```text
localhost:27017
```

because `localhost` inside the backend container refers to the backend container itself.

---

# Multi-Stage Builds

Both application images use multi-stage Docker builds.

### Client

```text
Node.js
   ↓
Angular production build
   ↓
NGINX runtime image
```

### Server

```text
Node.js
   ↓
TypeScript build
   ↓
Production Node.js runtime image
```

This keeps build dependencies separate from the final runtime image.

---

# Data Persistence

MongoDB uses:

```yaml
volumes:
  - mongo-data:/data/db
```

The volume provides persistent database storage outside the MongoDB container lifecycle.

A normal restart:

```bash
docker compose restart
```

does not remove the data.

Recreating the containers with:

```bash
docker compose down
docker compose up -d
```

also preserves the named volume.

---

# Useful Docker Commands

### View containers

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

### Follow logs

```bash
docker compose logs -f
```

### Backend logs

```bash
docker compose logs -f server
```

### Frontend logs

```bash
docker compose logs -f client
```

### MongoDB logs

```bash
docker compose logs -f database
```

### Restart

```bash
docker compose restart
```

### Stop containers

```bash
docker compose down
```

### Rebuild after changing code/configuration

```bash
docker compose build
docker compose up -d
```

### Inspect running containers

```bash
docker ps
```

---

# Documentation

Detailed documentation is available in:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/deployment-guide.md`](docs/deployment-guide.md)
- [`docs/troubleshooting.md`](docs/troubleshooting.md)

---

# Troubleshooting

## Frontend Shows "Welcome to nginx!"

Check the files inside the NGINX document root:

```bash
docker exec mean-client ls -lah /usr/share/nginx/html
```

The Angular build should be present.

The current Angular build produces `index.csr.html`, so the client image moves it to:

```text
/usr/share/nginx/html/index.html
```

during the image build.

---

## API Healthcheck Fails

Check:

```bash
docker compose ps
```

Then inspect backend logs:

```bash
docker compose logs server
```

Also test:

```bash
curl http://localhost:5300/healthcheck
```

---

## Employee Data Is Missing

Check that MongoDB is healthy:

```bash
docker compose ps
```

Then inspect:

```bash
docker compose logs database
```

Also verify that the MongoDB volume still exists.

Avoid:

```bash
docker compose down -v
```

unless you intentionally want to delete the database volume.

---

# Known Project Note: MongoDB Version

This learning deployment currently uses:

```text
mongo:4.4
```

This was intentionally selected for the local learning environment.

**MongoDB 4.4 is an old/EOL release and should not be considered a production recommendation.**

For future production-oriented deployment, the database version should be upgraded to a currently supported MongoDB release after compatibility testing.

---

# DevOps Roadmap

The project is intentionally being developed in stages.

## Phase 1 — Docker Compose ✅

Completed:

- Dockerized Angular frontend
- NGINX static serving
- NGINX reverse proxy
- Dockerized Node.js backend
- MongoDB container
- Docker Compose orchestration
- MongoDB healthcheck
- Service dependency
- Named persistent volume
- Multi-stage builds
- `.dockerignore`
- CRUD verification
- Restart/recreation persistence verification

---

## Phase 2 — Kubernetes 🚧

Planned:

```text
Namespace
Deployments
Services
ConfigMaps
Secrets
Persistent storage
Ingress
Liveness probes
Readiness probes
```

The application will first be deployed locally using a Kubernetes learning cluster.

---

## Phase 3 — Advanced Kubernetes

Planned:

- HPA
- RBAC
- NetworkPolicy
- PodDisruptionBudget
- Centralized logging
- Backup/restore
- Security scanning
- Rollback strategy
- Smoke tests
- Failure testing
- Multiple environments

Later:

- Helm
- Argo CD
- Service mesh
- Distributed tracing
- Chaos/failure experiments

---

## Phase 4 — AWS / EKS

After the local Kubernetes implementation is stable, the project can be moved toward AWS:

```text
AWS
 │
 └── EKS
      │
      ├── Frontend
      ├── Backend
      ├── Ingress
      └── Supporting infrastructure
```

The goal is to progressively transform the original application into a realistic DevOps/cloud portfolio project rather than jumping directly to cloud deployment.

---

# Original Project

This project is based on the original **MEAN Stack Example** application and its educational purpose.

The original application demonstrates:

- Angular frontend
- Express API
- MongoDB
- CRUD operations
- MongoDB schema validation

The Docker and DevOps work in this repository extends that application into a containerized deployment workflow.

---

# License

The original project is distributed under the **Apache 2.0** license.

See [`LICENSE`](LICENSE) for the license text.

---

## Project Status

**Current:** Docker Compose deployment completed and verified.

**Next:** Kubernetes deployment.

---

# 👨‍💻 Author

**Shivam Kumar Sinha**  
*DevOps | Cloud Computing | Linux | Networking | Docker | Kubernetes*

🌐 **Connect With Me:**
- 💼 **LinkedIn:** [Shivam Kumar Sinha](https://www.linkedin.com/in/shivam-kumar-sinha-0a9248308/)
- 💻 **GitHub:** [Shivam-Infra-Labs](https://github.com/Shivam-Infra-Labs)

---
# ⭐ Support

If you find this project helpful, please consider giving it a ⭐ **Star** on GitHub!

