# AGENTS.md

## Build and Test Commands

Use these commands from the repository root:

```bash
npm install
npm run build
npm run test
npm run seed
npm start
```

## Project Structure

- `client/`: Angular frontend
- `server/src/`: Express API, routes, MongoDB connection, schema validation
- `server/scripts/seed.ts`: deterministic sample-data seed script
- `README.md`: setup and architecture guide
- `EDD.md`: MongoDB entity/document schema contract

## Environment Variables and Configuration

Required:

- `ATLAS_URI`: MongoDB connection string used by server and seed script

Optional:

- `PORT`: API port (default: `5200`)

Configuration files:

- `server/.env.example`: example environment values
- `server/.env`: local environment values (create from example)

## MongoDB Skills

Use the official MongoDB agent skills from https://github.com/mongodb/agent-skills
whenever the task is MongoDB-specific and a matching skill exists.

## When To Use EDD.md

Use [EDD.md](./EDD.md) as the source of truth for the MongoDB data model in this repository.

Consult [EDD.md](./EDD.md) before making changes that touch:

- MongoDB collections, document structure, or field names
- Express routes that read or write database records
- Validation, form fields, API payloads, or UI that depend on persisted data
- Schema documentation, Mermaid diagrams, or entity modeling discussions
