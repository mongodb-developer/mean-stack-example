# Architecture

## 1. Current Docker Architecture

```text
                         Host Machine
                              │
                              │ :8080
                              ▼
                  ┌───────────────────────┐
                  │   mean-client         │
                  │   Angular + NGINX     │
                  │   container :80       │
                  └───────────┬───────────┘
                              │
                         /api/│
                              ▼
                  ┌───────────────────────┐
                  │   mean-server         │
                  │   Node + Express      │
                  │   container :5300     │
                  └───────────┬───────────┘
                              │
                         MongoDB
                              ▼
                  ┌───────────────────────┐
                  │   mean-db             │
                  │   MongoDB 4.4         │
                  │   container :27017    │
                  └───────────┬───────────┘
                              │
                              ▼
                       mongo-data volume
```

## 2. Service Responsibilities

### Client

The client container:

- contains the Angular production build
- serves static files through NGINX
- handles browser requests
- proxies `/api/` requests to the backend

### Server

The server container:

- runs the Node.js/Express application
- exposes port `5300`
- provides employee CRUD endpoints
- connects to MongoDB
- exposes `/healthcheck`

### Database

The database container:

- runs MongoDB 4.4
- stores the `meanStackExample` database
- stores the `employees` collection
- persists data using the `mongo-data` named volume

## 3. Request Flow

A browser request for the application:

```text
GET /
   ↓
localhost:8080
   ↓
NGINX
   ↓
Angular static files
```

An API request:

```text
GET /api/employees
   ↓
localhost:8080
   ↓
NGINX
   ↓
server:5300/employees
   ↓
Express
   ↓
MongoDB
```

The trailing `/` in the NGINX `proxy_pass` configuration causes the `/api/` prefix to be removed when forwarding the request.

## 4. Docker DNS

Docker Compose creates an internal network for the services.

The backend connects to MongoDB using:

```text
database:27017
```

not:

```text
localhost:27017
```

Inside the server container, `localhost` means the server container itself.

## 5. Startup Dependency

MongoDB has a healthcheck.

The server is configured to wait for:

```text
database → healthy
```

before starting.

This reduces startup race conditions between MongoDB and the backend.

The client starts after the server service has started.

## 6. Storage

MongoDB stores its data in:

```text
/data/db
```

which is backed by:

```text
mongo-data
```

The volume survives:

```bash
docker compose restart
```

and:

```bash
docker compose down
docker compose up -d
```

It is removed only when the volume is explicitly deleted, such as:

```bash
docker compose down -v
```

## 7. Network Exposure

The host exposes:

```text
8080 → client
5300 → server
```

MongoDB is not published to the host.

The database is therefore accessible to the backend through the internal Docker network without requiring a host port mapping.

## 8. Build Flow

### Client

```text
client source
    ↓
Node.js build stage
    ↓
Angular production build
    ↓
NGINX runtime image
```

### Server

```text
server source
    ↓
Node.js build stage
    ↓
TypeScript compilation
    ↓
production Node.js runtime
```

This separates build tooling from runtime containers.

## 9. Application Data Model

The backend uses:

```text
Database: meanStackExample
Collection: employees
```

Employee records contain:

```text
name
position
level
_id
```

The accepted `level` values are:

```text
junior
mid
senior
```

## 10. Current Limitations

The current Docker Compose deployment is intentionally a learning/portfolio stage.

It does not yet provide:

- Kubernetes orchestration
- high availability
- horizontal scaling
- production-grade secret management
- centralized observability
- automated CI/CD
- cloud infrastructure

These are planned for later project phases.
