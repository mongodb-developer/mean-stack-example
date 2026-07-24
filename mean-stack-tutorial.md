# How to Use the MEAN Stack: Build a Web Application From Scratch

## What is the MEAN Stack?

MEAN is a technology stack for building full-stack applications consisting of:

- **MongoDB** — a document database
- **Express** — a Node.js framework for building APIs
- **Angular** — a front-end application framework
- **Node.js** — a server-side JavaScript runtime environment

Applications follow a client-server architecture where Angular builds the client, Express handles the API, and MongoDB manages data persistence.

## What This Tutorial Covers

This tutorial builds a **RESTful API with CRUD operations** for an employee management application using MongoDB Atlas for data persistence.

The finished application includes:
- View all employees
- Add new employees
- Update existing employees

## Prerequisites

- Node.js (v20.11.1+)
- MongoDB Atlas cluster with connection string

> **Note:** This tutorial's client is built with **Angular 21** and ships with **server-side rendering (SSR) and hydration** enabled. Throughout, you'll also find _Modern Angular notes_ that point out newer v21 idioms (such as `inject()`, `output()`, `@for`, `httpResource()`, and zoneless change detection) as alternatives to the patterns shown.

## Building the Server-Side Application

### Project Setup

```bash
mkdir mean-stack-example
cd mean-stack-example
mkdir server && mkdir server/src
cd server
npm init -y
touch tsconfig.json .env
cd src && touch database.ts employee.routes.ts employee.ts server.ts
```

### Install Dependencies

```bash
npm install cors dotenv express mongodb
npm install --save-dev typescript @types/cors @types/express @types/node ts-node
```

### TypeScript Configuration

**server/tsconfig.json:**
```json
{
  "include": ["src/**/*"],
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

### Employee Interface

**server/src/employee.ts:**
```typescript
import * as mongodb from "mongodb";

export interface Employee {
  name: string;
  position: string;
  level: "junior" | "mid" | "senior";
  _id?: mongodb.ObjectId;
}
```

### Database Connection

**server/src/database.ts:**
```typescript
import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: { employees?: mongodb.Collection<Employee> } = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri, {
    appName: "devrel-tutorial-javascript-mean",
  });
  await client.connect();
  const db = client.db("meanStackExample");
  await applySchemaValidation(db);
  const employeesCollection = db.collection<Employee>("employees");
  collections.employees = employeesCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "position", "level"],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: "string",
          description: "'name' is required and is a string",
        },
        position: {
          bsonType: "string",
          description: "'position' is required and is a string",
          minLength: 5,
        },
        level: {
          bsonType: "string",
          description:
            "'level' is required and is one of 'junior', 'mid', or 'senior'",
          enum: ["junior", "mid", "senior"],
        },
      },
    },
  };

  await db
    .command({ collMod: "employees", validator: jsonSchema })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("employees", { validator: jsonSchema });
      }
    });
}
```

### Environment Configuration

The project commits a `server/.env.example` template; copy it to `server/.env` and fill in your connection string.

**server/.env:**
```
DATABASE_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/meanStackExample?retryWrites=true&w=majority
PORT=5300
```

### Server Setup

**server/src/server.ts:**
```typescript
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";

dotenv.config();

const { DATABASE_URI } = process.env;
const PORT = Number.parseInt(process.env.PORT ?? "5300", 10);

if (!DATABASE_URI) {
  console.error(
    "No DATABASE_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(DATABASE_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    app.get("/healthcheck", (_req, res) => {
      res.status(200).send({ status: "ok" });
    });

    app.use("/employees", employeeRouter);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}...`);
    });
  })
  .catch((error) => console.error(error));
```

> **Note:** JSON body parsing (`express.json()`) is registered on the employee router (see below) rather than at the app level, so it only applies to the `/employees` routes.

### RESTful API Routes

**server/src/employee.routes.ts:**
```typescript
import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

// GET /employees - Get all employees
employeeRouter.get("/", async (_req, res) => {
  try {
    const employees = await collections?.employees?.find({}).toArray();
    res.status(200).send(employees);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

// GET /employees/:id - Get single employee
employeeRouter.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const employee = await collections?.employees?.findOne(query);
    if (employee) {
      res.status(200).send(employee);
    } else {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
  }
});

// POST /employees - Create new employee
employeeRouter.post("/", async (req, res) => {
  try {
    const employee = req.body;
    const result = await collections?.employees?.insertOne(employee);
    if (result?.acknowledged) {
      res
        .status(201)
        .send(`Created a new employee: ID ${result.insertedId}.`);
    } else {
      res.status(500).send("Failed to create a new employee.");
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

// PUT /employees/:id - Update employee
employeeRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const employee = req.body;
    const query = { _id: new ObjectId(id) };
    const result = await collections?.employees?.updateOne(query, {
      $set: employee,
    });
    if (result && result.matchedCount) {
      res.status(200).send(`Updated an employee: ID ${id}.`);
    } else if (!result?.matchedCount) {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update an employee: ID ${id}`);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error(message);
    res.status(400).send(message);
  }
});

// DELETE /employees/:id - Delete employee
employeeRouter.delete("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await collections?.employees?.deleteOne(query);
    if (result && result.deletedCount) {
      res.status(202).send(`Removed an employee: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove an employee: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error(message);
    res.status(400).send(message);
  }
});
```

### Seeding Sample Data (optional)

The project includes a seed script that populates the `employees` collection with sample data, wired up as an npm script in **server/package.json**:

```json
{
  "scripts": {
    "start": "ts-node src/server.ts",
    "build": "tsc",
    "seed": "ts-node scripts/seed.ts",
    "test:integration": "tsx --test tests/api.integration.test.ts"
  }
}
```

Run it once your `DATABASE_URI` is configured:

```bash
npm run seed
```

### Integration Tests (optional)

The API is covered by integration tests that spin up an in-memory MongoDB instance with `mongodb-memory-server` and exercise the routes through `supertest` — no live Atlas connection required:

```bash
npm install --save-dev supertest @types/supertest mongodb-memory-server tsx
npm run test:integration
```

## Building the Client-Side Angular Application

### Project Setup

```bash
npm install -g @angular/cli
ng new client --inline-template --inline-style --minimal --routing --style=css --ssr
cd client
ng serve -o
ng add @angular/material
```

This project uses **Angular 21** with **server-side rendering (SSR)** enabled (`--ssr`), which generates `main.ts`, `app.config.ts`, and `app.config.server.ts` for you.

> **Modern Angular note:** As of Angular v20+, the CLI generates standalone files without the `.component` suffix (e.g. `app.ts` exporting a class named `App`). This tutorial keeps the classic `*.component.ts` / `AppComponent` naming to match the existing project. New apps may also opt into **zoneless** change detection (`provideZonelessChangeDetection()`) instead of Zone.js.

### Employee Interface

**client/src/app/employee.ts:**
```typescript
export interface Employee {
  name: string;
  position: string;
  level: 'junior' | 'mid' | 'senior';
  _id?: string;
}
```

### API Configuration Service

Rather than hardcoding the API URL, the app derives it at runtime so it works locally, in Codespaces, and under SSR. In the browser it reuses the current hostname on port `5300`; on the server it falls back to `localhost`.

**client/src/app/api-config.service.ts:**
```typescript
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  get baseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:5300`;
    }
    return 'http://localhost:5300';
  }
}
```

> **Modern Angular note:** Prefer the `inject()` function over constructor parameter injection, e.g. `private platformId = inject(PLATFORM_ID);`.

### Employee Service

**client/src/app/employee.service.ts:**
```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url = this.apiConfig.baseUrl;
  employees$ = signal<Employee[]>([]);
  employee$ = signal<Employee>({} as Employee);

  constructor(
    private httpClient: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  private refreshEmployees() {
    this.httpClient.get<Employee[]>(`${this.url}/employees`).subscribe(
      employees => {
        this.employees$.set(employees);
      }
    );
  }

  getEmployees() {
    this.refreshEmployees();
    return this.employees$();
  }

  getEmployee(id: string) {
    this.httpClient
      .get<Employee>(`${this.url}/employees/${id}`)
      .subscribe(employee => {
        this.employee$.set(employee);
        return this.employee$();
      });
  }

  createEmployee(employee: Employee) {
    return this.httpClient.post(`${this.url}/employees`, employee, {
      responseType: 'text'
    });
  }

  updateEmployee(id: string, employee: Employee) {
    return this.httpClient.put(
      `${this.url}/employees/${id}`,
      employee,
      { responseType: 'text' }
    );
  }

  deleteEmployee(id: string) {
    return this.httpClient.delete(`${this.url}/employees/${id}`, {
      responseType: 'text'
    });
  }
}
```

> **Modern Angular note:** This service uses `HttpClient` with `.subscribe()` and writes results into signals manually. In Angular v20+ you can fetch reactively with `httpResource()` (or the more general `resource()`), which exposes the response as a signal and handles loading/error state for you — removing the need for manual subscriptions and `.set()` calls.

### HTTP Client Configuration

The `--ssr` schematic generates `app.config.ts` (browser) and `app.config.server.ts` (server). Add `provideHttpClient(withFetch())` to the browser providers.

**client/src/app/app.config.ts:**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ],
};
```

**client/src/main.ts:**
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [provideZoneChangeDetection(), ...appConfig.providers],
}).catch((err) => console.error(err));
```

**client/src/app/app.config.server.ts:**
```typescript
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

### Employees List Component

```bash
ng generate component employees-list
```

**client/src/app/employees-list/employees-list.component.ts:**
```typescript
import { Component, Inject, OnInit, PLATFORM_ID, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatCardModule],
  styles: [`
    table { width: 100%; }
    button:first-of-type { margin-right: 1rem; }
  `],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Employees List</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="employees$()">
          <ng-container matColumnDef="col-name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>
          <ng-container matColumnDef="col-position">
            <th mat-header-cell *matHeaderCellDef>Position</th>
            <td mat-cell *matCellDef="let element">{{ element.position }}</td>
          </ng-container>
          <ng-container matColumnDef="col-level">
            <th mat-header-cell *matHeaderCellDef>Level</th>
            <td mat-cell *matCellDef="let element">{{ element.level }}</td>
          </ng-container>
          <ng-container matColumnDef="col-action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let element">
              <button mat-raised-button [routerLink]="['edit/', element._id]">
                Edit
              </button>
              <button
                mat-raised-button
                color="warn"
                (click)="deleteEmployee(element._id || '')"
              >
                Delete
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" [routerLink]="['new']">
          Add a New Employee
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class EmployeesListComponent implements OnInit {
  employees$ = {} as WritableSignal<Employee[]>;
  displayedColumns: string[] = ['col-name', 'col-position', 'col-level', 'col-action'];

  constructor(
    private employeesService: EmployeeService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    // Only fetch in the browser to avoid duplicate requests during SSR.
    if (isPlatformBrowser(this.platformId)) {
      this.fetchEmployees();
    }
  }

  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.fetchEmployees(),
    });
  }

  private fetchEmployees(): void {
    this.employees$ = this.employeesService.employees$;
    this.employeesService.getEmployees();
  }
}
```

> **Modern Angular note:** The list uses Angular Material's table structural directives (`*matHeaderCellDef`, `*matCellDef`). For a plain list you could instead use the built-in `@for` control-flow block. Also consider `inject()` instead of constructor injection for the service and `PLATFORM_ID`.

### Employee Form Component

```bash
ng generate component employee-form
```

**client/src/app/employee-form/employee-form.component.ts:**
```typescript
import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  styles: [`
    .employee-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `],
  template: `
    <form class="employee-form" autocomplete="off" [formGroup]="employeeForm"
          (submit)="submitForm()">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Name" formControlName="name" required />
        @if (name.invalid) {
          <mat-error>Name must be at least 3 characters long.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Position</mat-label>
        <input matInput placeholder="Position" formControlName="position" required />
        @if (position.invalid) {
          <mat-error>Position must be at least 5 characters long.</mat-error>
        }
      </mat-form-field>
      <mat-radio-group formControlName="level" aria-label="Select an option">
        <mat-radio-button name="level" value="junior" required>
          Junior
        </mat-radio-button>
        <mat-radio-button name="level" value="mid">Mid</mat-radio-button>
        <mat-radio-button name="level" value="senior">Senior</mat-radio-button>
      </mat-radio-group>
      <br />
      <button mat-raised-button color="primary" type="submit"
              [disabled]="employeeForm.invalid">
        Add
      </button>
    </form>
  `,
})
export class EmployeeFormComponent {
  initialState = input<Employee>();
  @Output() formValuesChanged = new EventEmitter<Employee>();
  @Output() formSubmitted = new EventEmitter<Employee>();

  employeeForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    position: ['', [Validators.required, Validators.minLength(5)]],
    level: ['junior', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.employeeForm.setValue({
        name: this.initialState()?.name || '',
        position: this.initialState()?.position || '',
        level: this.initialState()?.level || 'junior',
      });
    });
  }

  get name() {
    return this.employeeForm.get('name')!;
  }

  get position() {
    return this.employeeForm.get('position')!;
  }

  get level() {
    return this.employeeForm.get('level')!;
  }

  submitForm() {
    this.formSubmitted.emit(this.employeeForm.value as Employee);
  }
}
```

> **Modern Angular note:** This component mixes idioms — it uses the modern signal-based `input<Employee>()` but the older `@Output()` / `EventEmitter` for events. Prefer the `output()` function: `formSubmitted = output<Employee>();`. Constructor DI of `FormBuilder` can likewise become `private formBuilder = inject(FormBuilder);`.

### Add Employee Component

```bash
ng generate component add-employee
```

**client/src/app/add-employee/add-employee.component.ts:**
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [EmployeeFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a New Employee</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-employee-form (formSubmitted)="addEmployee($event)"></app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class AddEmployeeComponent {
  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  addEmployee(employee: Employee) {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create employee');
        console.error(error);
      },
    });
    this.employeeService.getEmployees();
  }
}
```

### Edit Employee Component

```bash
ng generate component edit-employee
```

**client/src/app/edit-employee/edit-employee.component.ts:**
```typescript
import { Component, OnInit, WritableSignal } from '@angular/core';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [EmployeeFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit an Employee</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-employee-form [initialState]="employee()"
                          (formSubmitted)="editEmployee($event)">
        </app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class EditEmployeeComponent implements OnInit {
  employee = {} as WritableSignal<Employee>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }
    this.employeeService.getEmployee(id!);
    this.employee = this.employeeService.employee$;
  }

  editEmployee(employee: Employee) {
    this.employeeService
      .updateEmployee(this.employee()._id || '', employee)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Failed to update employee');
          console.error(error);
        },
      });
  }
}
```

### Routing Configuration

**client/src/app/app.routes.ts:**
```typescript
import { Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';

export const routes: Routes = [
  { path: '', component: EmployeesListComponent, title: 'Employees List' },
  { path: 'new', component: AddEmployeeComponent },
  { path: 'edit/:id', component: EditEmployeeComponent },
];
```

### Main App Component

**client/src/app/app.component.ts:**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmployeesListComponent, MatToolbarModule],
  styles: [`
    main {
      display: flex;
      justify-content: center;
      padding: 2rem 4rem;
    }
  `],
  template: `
    <mat-toolbar>
      <span>Employees Management System</span>
    </mat-toolbar>
    <main>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  title = 'client';
}
```

## Conclusion

This tutorial demonstrates how to build a complete full-stack application using the MEAN stack. The advantages include:

- **Single Language**: Use JavaScript throughout the entire stack
- **Natural Data Mapping**: MongoDB's document model maps naturally to objects
- **Scalability**: MongoDB Atlas provides reliable data persistence
- **Cost-Effective**: Free tier available to get started

The finished project is available on [GitHub](https://github.com/mongodb-developer/mean-stack-example).
