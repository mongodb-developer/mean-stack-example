# MEAN Stack Example: Employee Records App (MongoDB, Express, Angular, Node.js)

A full-stack CRUD application built with MongoDB, Express, Angular, and Node.js (MEAN).

Companion code for the [MEAN Stack Tutorial](https://www.mongodb.com/languages/mean-stack-tutorial?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel).

[![CI](https://github.com/mongodb-developer/mean-stack-example/actions/workflows/ci.yml/badge.svg)](https://github.com/mongodb-developer/mean-stack-example/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mongodb-developer/mean-stack-example?style=social)](https://github.com/mongodb-developer/mean-stack-example/stargazers)

## Project Overview

This project demonstrates an employee record tracker:

- Create records
- Read records from MongoDB
- Update records
- Delete records

The Angular app in `client` calls an Express API in `server`, and data is stored in MongoDB.

## MEAN Stack Architecture

```text
┌─────────────────────┐       REST (JSON)      ┌──────────────────────────┐
│   Angular (CLI)     │ ─────────────────────► │  Express API             │
│   client            │ ◄───────────────────── │  server                  │
│   :4200             │                        │  :5300                   │
└─────────────────────┘                        └───────────┬──────────────┘
                                                           │ MongoDB Node.js driver
                                                           ▼
                                               ┌──────────────────────────┐
                                               │  MongoDB                 │
                                               │  database: meanStackExample
                                               │  collection: employees   │
                                               └──────────────────────────┘
```

Stack:

- Frontend: Angular 21, Angular Material
- Backend: Node.js, Express 4, TypeScript, MongoDB Node.js Driver 6
- Database: MongoDB (`meanStackExample.employees` collection)

## Project Structure

```text
client/   # Angular frontend
server/   # Express API + MongoDB integration
```

## Prerequisites

- Node.js ^24.18.0
- npm ^11.16.0
- A local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel) cluster

## Quick Start and MongoDB Setup

```bash
# 1) Clone
git clone https://github.com/mongodb-developer/mean-stack-example.git
cd mean-stack-example

# 2) Create server environment file
cp server/.env.example server/.env
```

Update `server/.env` with one of the following `DATABASE_URI` values:

Local MongoDB:

```env
DATABASE_URI=mongodb://localhost:27017/
PORT=5300
```

Atlas cluster:

```env
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
PORT=5300
```

If you are new to Atlas, use the [Atlas quick start guide](https://www.mongodb.com/docs/atlas/getting-started/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel) and then paste your connection string into `DATABASE_URI`.

Optional: seed sample data:

```bash
(cd server && npm install && npm run seed)
```

Start the backend API:

```bash
cd server
npm start
```

Start the frontend in a second terminal:

```bash
cd client
npm install
npm start
```

Open `http://localhost:4200`.

## GitHub Codespaces and Dev Containers

GitHub Codespaces is an easy and fast way to get this project running without installing anything locally. It uses a dev container, which is a Docker environment configured for development.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mongodb-developer/mean-stack-example?quickstart=1)

## REST API Endpoints

Base URL: `http://localhost:5300`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/healthcheck` | Check API readiness |
| `GET` | `/employees` | Retrieve all employees |
| `GET` | `/employees/:id` | Retrieve one employee by ID |
| `POST` | `/employees` | Create an employee |
| `PUT` | `/employees/:id` | Update an employee |
| `DELETE` | `/employees/:id` | Delete an employee |

Example request body for create or update:

```json
{
    "name": "Jane Smith",
    "position": "Developer",
    "level": "senior"
}
```

## MongoDB Features Demonstrated

| Feature | Where |
|---|---|
| [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel) | `server/src/database.ts` |
| [CRUD operations](https://www.mongodb.com/docs/manual/crud/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel) | `server/src/employee.routes.ts` |
| [MongoDB schema validation](https://www.mongodb.com/docs/manual/core/schema-validation/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel) | startup validation in `server/src/database.ts` |
| [Environment-based connection setup](https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel) | `DATABASE_URI` in `server/.env` |

## Troubleshooting

### Cannot connect to MongoDB Atlas

- Verify `DATABASE_URI` in `server/.env`
- Confirm your database user credentials are correct (Atlas)
- Confirm your IP is in [Atlas Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel)

### Backend fails to start

- Check Node version: `node --version`
- Confirm `server/.env` exists
- Reinstall dependencies in `server`: `npm install`

### Frontend shows empty data

- Confirm backend is running on `:5300`
- Open browser dev tools and check network requests
- Confirm records exist in MongoDB (or run `cd server && npm run seed`)

### Port already in use

- Change `PORT` in `server/.env`, or stop the process using `:5300`

## Community and Support

- Use [GitHub Issues](https://github.com/mongodb-developer/mean-stack-example/issues) for bugs and feature requests
- Use [MongoDB Community Forums](https://www.mongodb.com/community/forums/) for general MongoDB questions

## Additional Resources

- [MEAN Stack Tutorial](https://www.mongodb.com/languages/mean-stack-tutorial?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel)
- [MongoDB Node.js Driver Docs](https://www.mongodb.com/docs/drivers/node/current/?utm_campaign=devrel&utm_medium=github&utm_content=mean.stack.example&utm_term=learning.fuel)

## License

[Apache 2.0](LICENSE)

## Disclaimer

This repository is for educational use and is not a supported MongoDB product.
