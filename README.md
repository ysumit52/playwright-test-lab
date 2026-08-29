# Playwright Test Lab

A full-stack test laboratory project built with **Angular**, **NestJS**, **PostgreSQL**, and **Docker**.

The project is structured as a monorepo containing:

* **Frontend:** Angular
* **Backend:** NestJS
* **Database:** PostgreSQL 17
* **Containerization:** Docker & Docker Compose
* **Package Manager:** npm 11.19.0
* **Testing:** Jest / Angular Test Runner / Playwright

---

## Project Structure

```text
playwright-test-lab/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── proxy.conf.json
│   ├── Dockerfile
│   └── .env.example
│
├── backend/
│   ├── src/
│   ├── test/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

---

## Prerequisites

Install the following before running the project:

* Node.js
* npm 11.19.0
* Docker
* Docker Compose

Verify your versions:

```bash
node --version
npm --version
docker --version
docker compose version
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd playwright-test-lab
```

Install dependencies for both frontend and backend:

```bash
npm run install:all
```

This runs:

```bash
npm install --prefix frontend
npm install --prefix backend
```

---

## Environment Configuration

The project uses `.env.example` files as templates for environment configuration.

Copy the root environment file:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Copy the frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

Copy the backend environment file:

```bash
cp backend/.env.example backend/.env
```

> Do not commit `.env` files containing secrets or environment-specific credentials.

---

## Environment Variables

### Root `.env`

The root environment file can contain PostgreSQL and other shared configuration:

```env
POSTGRES_DB=playwright_lab
POSTGRES_USER=playwright_user
POSTGRES_PASSWORD=playwright_password
COOKIE_SECRET=development-secret
```

Docker Compose provides defaults for these values, so a root `.env` is optional for local development.

---

## Running Locally

### Start Database

Start only PostgreSQL:

```bash
npm run db:up
```

PostgreSQL will be available on:

```text
localhost:5433
```

Database defaults:

```text
Database: playwright_lab
Username: playwright_user
Password: playwright_password
Port: 5433
```

---

### Start Backend

Run the NestJS backend in development/watch mode:

```bash
npm run dev:backend
```

Backend:

```text
http://localhost:3000
```

---

### Start Frontend

Run Angular:

```bash
npm run dev:frontend
```

Frontend:

```text
http://localhost:4200
```

The Angular application uses:

```text
proxy.conf.json
```

for forwarding API requests to the backend.

---

### Start Full Development Environment

The easiest way to start the entire local development environment is:

```bash
npm run dev
```

This command:

1. Starts PostgreSQL.
2. Starts the NestJS backend in watch mode.
3. Starts the Angular frontend.
4. Runs frontend and backend concurrently.

The expected services are:

```text
Angular     → http://localhost:4200
NestJS      → http://localhost:3000
PostgreSQL  → localhost:5433
```

---

## Database Commands

### Start PostgreSQL

```bash
npm run db:up
```

### Stop Docker Compose Services

```bash
npm run db:down
```

### View PostgreSQL Logs

```bash
npm run db:logs
```

---

# Docker

The project includes Dockerfiles for both the frontend and backend and a `docker-compose.yml` for running the complete application stack.

## Start Complete Docker Environment

```bash
npm run docker:up
```

Equivalent command:

```bash
docker compose up --build
```

This starts:

```text
PostgreSQL
    ↓
NestJS Backend
    ↓
Angular Frontend
```

Services:

| Service    | Host Port | Container Port |
| ---------- | --------: | -------------: |
| PostgreSQL |      5433 |           5432 |
| Backend    |      3000 |           3000 |
| Frontend   |      4200 |             80 |

Access the application at:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:3000
```

---

## Stop Docker Environment

```bash
npm run docker:down
```

Equivalent:

```bash
docker compose down
```

---

## Reset Docker Environment

To remove containers and the PostgreSQL volume and recreate everything:

```bash
npm run docker:reset
```

Equivalent:

```bash
docker compose down -v
docker compose up --build
```

> **Warning:** `docker:reset` deletes the PostgreSQL Docker volume and therefore removes the local database data.

---

# Docker Compose

The application consists of three services.

## PostgreSQL

```yaml
postgres:
  image: postgres:17-alpine
  ports:
    - "5433:5432"
```

The database data is persisted in:

```text
playwright_lab_postgres_data
```

A health check is configured so the backend starts only after PostgreSQL is healthy.

---

## Backend

The NestJS backend runs on:

```text
http://localhost:3000
```

Inside Docker, the backend connects to PostgreSQL using the Docker service name:

```text
DB_HOST=postgres
DB_PORT=5432
```

Note that the backend uses port `5432` to communicate with PostgreSQL **inside the Docker network**, while your host machine uses port `5433`.

---

## Frontend

The Angular application is built and served through the frontend Docker image.

Host:

```text
http://localhost:4200
```

The container exposes:

```text
80
```

Therefore:

```text
localhost:4200 → frontend container port 80
```

---

# Frontend

The frontend is an Angular application.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Angular development server:

```bash
npm start
```

This executes:

```bash
ng serve --proxy-config proxy.conf.json
```

### Frontend Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm start`     | Start Angular development server       |
| `npm run build` | Build Angular application              |
| `npm run watch` | Build continuously in development mode |
| `npm test`      | Run Angular tests                      |

The project uses:

```json
"packageManager": "npm@11.19.0"
```

---

# Backend

The backend is built using NestJS.

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start backend:

```bash
npm run start
```

Start in development/watch mode:

```bash
npm run start:dev
```

### Backend Scripts

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `npm run build`       | Build NestJS application              |
| `npm run start`       | Start application                     |
| `npm run start:dev`   | Start with watch mode                 |
| `npm run start:debug` | Start with Node debugger              |
| `npm run start:prod`  | Start compiled production application |
| `npm run deploy`      | Deploy using Nest CLI                 |
| `npm run format`      | Format TypeScript files               |
| `npm run lint`        | Run Oxlint                            |
| `npm test`            | Run Jest tests                        |
| `npm run test:watch`  | Run Jest in watch mode                |
| `npm run test:cov`    | Generate test coverage                |
| `npm run test:debug`  | Debug Jest tests                      |
| `npm run test:e2e`    | Run end-to-end tests                  |

---

# Testing

## Backend Unit Tests

From the project root:

```bash
npm run test:backend
```

Or from `backend/`:

```bash
npm test
```

---

## Backend Test Coverage

```bash
cd backend
npm run test:cov
```

---

## Backend E2E Tests

```bash
cd backend
npm run test:e2e
```

---

## Frontend Tests

From the project root:

```bash
npm run test:frontend
```

Or:

```bash
cd frontend
npm test
```

---

# Build

Build both frontend and backend:

```bash
npm run build
```

This executes:

```bash
npm run build --prefix backend
npm run build --prefix frontend
```

---

# Root NPM Commands

The root `package.json` provides convenient commands for working with the entire project.

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run install:all`   | Install frontend and backend dependencies      |
| `npm run db:up`         | Start PostgreSQL                               |
| `npm run db:down`       | Stop Docker Compose services                   |
| `npm run db:logs`       | Follow PostgreSQL logs                         |
| `npm run dev`           | Start DB + backend + frontend                  |
| `npm run dev:backend`   | Start backend only                             |
| `npm run dev:frontend`  | Start frontend only                            |
| `npm run build`         | Build backend and frontend                     |
| `npm run docker:up`     | Build and start Docker environment             |
| `npm run docker:down`   | Stop Docker environment                        |
| `npm run docker:reset`  | Remove volumes and recreate Docker environment |
| `npm run test:backend`  | Run backend tests                              |
| `npm run test:frontend` | Run frontend tests                             |

---

# Recommended Development Workflow

For normal development, use:

```bash
npm run install:all
npm run dev
```

Then open:

```text
http://localhost:4200
```

The development architecture is:

```text
                ┌─────────────────────┐
                │      Angular        │
                │    Port: 4200       │
                └──────────┬──────────┘
                           │
                           │ API
                           ▼
                ┌─────────────────────┐
                │       NestJS        │
                │    Port: 3000       │
                └──────────┬──────────┘
                           │
                           │ PostgreSQL
                           ▼
                ┌─────────────────────┐
                │     PostgreSQL      │
                │    Port: 5433       │
                └─────────────────────┘
```

---

# Docker Development Workflow

To run everything inside Docker:

```bash
npm run docker:up
```

Then open:

```text
http://localhost:4200
```

To stop:

```bash
npm run docker:down
```

To completely reset the local database:

```bash
npm run docker:reset
```

---

# Useful Docker Commands

List running containers:

```bash
docker compose ps
```

View all service logs:

```bash
docker compose logs -f
```

View backend logs:

```bash
docker compose logs -f backend
```

View frontend logs:

```bash
docker compose logs -f frontend
```

View PostgreSQL logs:

```bash
docker compose logs -f postgres
```

Open a PostgreSQL shell:

```bash
docker exec -it playwright-lab-postgres psql \
  -U playwright_user \
  -d playwright_lab
```

---

# Troubleshooting

## PostgreSQL Port Already in Use

If port `5433` is already being used, check which process is using it.

Windows:

```powershell
netstat -ano | findstr :5433
```

You can also change the host-side port in `docker-compose.yml`.

For example:

```yaml
ports:
  - "5434:5432"
```

The container will continue to use port `5432`.

---

## Backend Cannot Connect to PostgreSQL

When running the backend **locally**, PostgreSQL should be accessed using:

```env
DB_HOST=localhost
DB_PORT=5433
```

When running the backend **inside Docker**, use:

```env
DB_HOST=postgres
DB_PORT=5432
```

Do not use `localhost:5433` from inside the backend container because `localhost` refers to the backend container itself.

---

## Recreate the Database

If the local PostgreSQL database needs to be completely recreated:

```bash
npm run docker:reset
```

This removes the PostgreSQL Docker volume.

---

# Security

Do not commit secrets or local environment files.

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
coverage/
.angular/
.env
.env.local
.env.*.local
```

Keep example configuration files such as:

```text
.env.example
```

in Git so other developers know which variables are required.

---

# Technology Stack

* **Angular** — Frontend framework
* **NestJS** — Backend framework
* **Node.js** — JavaScript runtime
* **TypeScript** — Application language
* **PostgreSQL 17** — Relational database
* **Docker** — Containerization
* **Docker Compose** — Local multi-container orchestration
* **Jest** — Backend/frontend testing
* **Playwright** — Browser/end-to-end testing

---

# Quick Start

For a new developer:

```bash
git clone <repository-url>
cd playwright-test-lab

npm run install:all

npm run dev
```

Then open:

```text
http://localhost:4200
```

For the Docker setup:

```bash
npm run docker:up
```

Then open:

```text
http://localhost:4200
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
