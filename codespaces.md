# 👋 Welcome to the MEAN Stack Example

This Codespace is **already up and running** — dependencies are installed, the database is seeded, and both the API and the Angular client have started for you. There's nothing to `npm install` or `npm start`; just wait a few seconds for the servers to finish booting.

## 🚀 What's running

| Service | Port | Description |
|---------|------|-------------|
| **Angular Client** | `4200` | The web app (opens automatically in a Simple Browser preview) |
| **Express API** | `5300` | REST API for employee CRUD operations |
| **MongoDB** | `27017` | Local database, pre-seeded with sample employees |

The **Angular Client** preview opens on its own when the client finishes compiling. If you don't see it (or you closed it), open the **Ports** tab, find port **4200** ("Angular Client"), and click the 🌐 globe icon to open the preview.

> ⏳ First launch takes a moment while the client compiles. If the preview shows an error at first, give it a few seconds and refresh.

## 🧭 Try it out

In the client preview you can:

- **View** the seeded list of employees.
- **Add a New Employee** with the button below the list.
- **Edit** or **Delete** any row with the action buttons.

Changes are saved through the Express API to MongoDB and reflected in the list immediately.

You can also hit the API directly from the terminal:

```bash
curl http://localhost:5300/healthcheck   # → {"status":"ok"}
curl http://localhost:5300/employees      # → the seeded employees
```

## 🗂️ Project structure

```
server/   Express + MongoDB REST API (TypeScript)
  src/
    server.ts            App entry, CORS, /healthcheck, mounts the router
    employee.routes.ts   CRUD routes for /employees
    database.ts          MongoDB connection + schema validation
client/   Angular 22 app (standalone, zoneless, SSR)
  src/app/
    employees-list/      List view (Material table)
    employee-form/       Shared reactive form
    add-employee/        Create page
    edit-employee/       Edit page (loaded via a route resolver)
    employee.service.ts  httpResource + CRUD calls to the API
```

## ✏️ Making changes

Both servers run in **watch mode** — just edit and save:

- Edit files under **`client/src/`** → the client rebuilds and the preview reloads.
- Edit files under **`server/src/`** → restart the API from the terminal if needed:
  ```bash
  cd server && npm start
  ```

## 🌱 Reseeding the database

The database is seeded on startup. To reset it to the sample data at any time:

```bash
npm run seed
```

## 🧪 Running tests

```bash
npm test              # client + server unit tests
npm run test:integration   # API integration tests (in-memory MongoDB)
```

## 📚 Learn more

This project is the companion code for the [MEAN Stack Tutorial](https://www.mongodb.com/resources/languages/mean-stack-tutorial). Happy hacking! 🎉
