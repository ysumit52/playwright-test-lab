# Dockerized Node.js Orders API

A REST API built with Node.js, Express, PostgreSQL, JWT authentication, and Zod validation. Both the API and PostgreSQL database run in Docker containers.

## Features

- Node.js and Express REST API
- PostgreSQL database
- Docker and Docker Compose support
- PostgreSQL exposed on host port `5444`
- JWT-based authentication
- Password hashing with `bcryptjs`
- Request validation with Zod
- Protected Orders API
- Database constraints for order data
- Automatic database table creation
- Default test user and example order

## Technology Stack

- Node.js 22
- Express
- PostgreSQL 17
- Docker
- Docker Compose
- JSON Web Token
- Zod
- bcryptjs
- node-postgres (`pg`)

## Project Structure

```text
docker-node-orders/
├── src/
│   └── server.js
├── .dockerignore
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Prerequisites

Install the following tools:

- [Docker](https://www.docker.com/)
- Docker Compose

Check the installations:

```bash
docker --version
docker compose version
```

Node.js and PostgreSQL do not need to be installed locally because they run inside Docker.

## Environment Configuration

The `.env` file contains the application and database configuration:

```env
PORT=3000

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_EXTERNAL_PORT=5444
POSTGRES_DB=orders_db
POSTGRES_USER=id0345
POSTGRES_PASSWORD=test@345++

JWT_SECRET=change-this-to-a-long-random-production-secret
JWT_EXPIRES_IN=1h
```

> Change `JWT_SECRET` to a long, random value before using the project in production.

## PostgreSQL Ports

PostgreSQL uses two relevant port values:

| Connection source | Host | Port |
|---|---|---:|
| Node.js Docker container | `db` | `5432` |
| Host computer | `localhost` | `5444` |

The API container must connect to:

```text
db:5432
```

Applications running directly on your computer must connect to:

```text
localhost:5444
```

Do not configure the API container to use port `5444`. That is only the externally exposed host port.

## Database Credentials

```text
Database: orders_db
Username: id0345
Password: test@345++
```

Host connection URL:

```text
postgresql://id0345:test%40345%2B%2B@localhost:5444/orders_db
```

The password is URL encoded in the connection URL:

- `@` becomes `%40`
- `+` becomes `%2B`

## Start the Application

Run this command from the project root:

```bash
docker compose up --build
```

Run the containers in the background:

```bash
docker compose up --build -d
```

The API will be available at:

```text
http://localhost:3000
```

PostgreSQL will be available from the host at:

```text
localhost:5444
```

## Check Container Status

```bash
docker compose ps
```

Expected services:

- `orders-api`
- `orders-postgres`

## View Logs

View logs for all services:

```bash
docker compose logs -f
```

View only API logs:

```bash
docker compose logs -f api
```

View only PostgreSQL logs:

```bash
docker compose logs -f db
```

## Default Login Account

The application automatically creates this test account:

```text
Username: testuser
Password: Password123
```

> These credentials are intended for local development only.

## API Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Check API and database status |
| `POST` | `/api/login` | No | Authenticate and receive a JWT |
| `GET` | `/api/orders` | Bearer token | Get all orders |
| `GET` | `/api/orders/:orderId` | Bearer token | Get an order by ID |
| `POST` | `/api/orders` | Bearer token | Create an order |

## Health Check

### Request

```bash
curl http://localhost:3000/api/health
```

### Response

```json
{
  "status": "UP",
  "database": "UP"
}
```

## Login

### Endpoint

```text
POST /api/login
```

### Request

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123"
  }'
```

### Successful Response

```json
{
  "token": "<generated-jwt-token>"
}
```

The token is dynamically generated and expires after the duration configured by `JWT_EXPIRES_IN`.

### Invalid Credentials Response

HTTP status:

```text
401 Unauthorized
```

Response:

```json
{
  "error": "Invalid username or password"
}
```

## Authorization

Protected endpoints require an `Authorization` header:

```text
Authorization: Bearer <token>
```

Example:

```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>"
```

Replace `<token>` with the JWT returned by `/api/login`.

## Get All Orders

### Endpoint

```text
GET /api/orders
```

### Request

```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>"
```

### Response

```json
[
  {
    "orderId": 1001,
    "customerName": "John",
    "status": "CONFIRMED",
    "amount": 2500
  }
]
```

## Get an Order by ID

### Endpoint

```text
GET /api/orders/:orderId
```

### Request

```bash
curl http://localhost:3000/api/orders/1001 \
  -H "Authorization: Bearer <token>"
```

### Response

```json
{
  "orderId": 1001,
  "customerName": "John",
  "status": "CONFIRMED",
  "amount": 2500
}
```

If the order does not exist, the API returns:

```json
{
  "error": "Order not found"
}
```

## Create an Order

### Endpoint

```text
POST /api/orders
```

### Request

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "orderId": 1002,
    "customerName": "Alice",
    "status": "PENDING",
    "amount": 1500
  }'
```

### Response

HTTP status:

```text
201 Created
```

Response:

```json
{
  "orderId": 1002,
  "customerName": "Alice",
  "status": "PENDING",
  "amount": 1500
}
```

## Order Validation Rules

An order must have the following fields:

| Field | Required | Rule |
|---|---:|---|
| `orderId` | Yes | Must be an integer |
| `customerName` | Yes | Must be a non-empty string |
| `status` | Yes | Must be `PENDING`, `CONFIRMED`, or `CANCELLED` |
| `amount` | Yes | Must be a number greater than `0` |

Valid example:

```json
{
  "orderId": 1001,
  "customerName": "John",
  "status": "CONFIRMED",
  "amount": 2500
}
```

Invalid example:

```json
{
  "orderId": "1002",
  "customerName": "",
  "status": "SHIPPED",
  "amount": 0
}
```

Example validation response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "orderId",
      "message": "orderId must be an integer"
    },
    {
      "field": "customerName",
      "message": "customerName cannot be empty"
    },
    {
      "field": "status",
      "message": "status must be PENDING, CONFIRMED, or CANCELLED"
    },
    {
      "field": "amount",
      "message": "amount must be greater than 0"
    }
  ]
}
```

## HTTP Status Codes

| Status | Meaning |
|---:|---|
| `200` | Request completed successfully |
| `201` | Order created successfully |
| `400` | Request validation failed |
| `401` | Missing, invalid, or expired token |
| `404` | Endpoint or order not found |
| `409` | An order with the same `orderId` already exists |
| `500` | Internal server error |

## Connect to PostgreSQL

If `psql` is installed on your computer:

```bash
psql \
  --host=localhost \
  --port=5444 \
  --username=id0345 \
  --dbname=orders_db
```

Enter this password when prompted:

```text
test@345++
```

You can also connect through the PostgreSQL container:

```bash
docker compose exec db psql \
  -U id0345 \
  -d orders_db
```

## Useful Database Commands

List tables:

```sql
\dt
```

View users:

```sql
SELECT id, username, created_at
FROM users;
```

View orders:

```sql
SELECT *
FROM orders
ORDER BY order_id;
```

Exit `psql`:

```text
\q
```

## Stop the Application

Stop and remove the containers:

```bash
docker compose down
```

Stop and remove the containers and database volume:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` permanently deletes all database data stored in the Docker volume.

## Restart the Application

```bash
docker compose restart
```

To rebuild after changing application files:

```bash
docker compose up --build -d
```

## Reset the Database

To remove all existing database data and initialize a clean database:

```bash
docker compose down -v
docker compose up --build
```

This operation recreates:

- The `users` table
- The `orders` table
- The `testuser` account
- The example order with order ID `1001`

## Troubleshooting

### Port 5444 Is Already in Use

Check which process is using the port:

```bash
sudo lsof -i :5444
```

Alternatively, change the external port in `.env`:

```env
POSTGRES_EXTERNAL_PORT=5445
```

The API configuration does not need to change because it continues to connect to `db:5432`.

### Port 3000 Is Already in Use

Change the API port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"
```

The API will then be available at:

```text
http://localhost:3001
```

### Authentication Fails After Changing Database Credentials

PostgreSQL credentials are applied only when the database volume is first created. Recreate the volume:

```bash
docker compose down -v
docker compose up --build
```

This deletes existing database data.

### Database Connection Error

Check the service status:

```bash
docker compose ps
```

Check PostgreSQL logs:

```bash
docker compose logs db
```

The API container should use:

```env
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

It should not use `localhost` or port `5444` when connecting from inside Docker.

### Invalid or Expired Token

Log in again to generate a new token:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123"
  }'
```

## Security Notes

Before deploying to production:

- Replace the default PostgreSQL password.
- Replace `JWT_SECRET` with a strong random secret.
- Remove or change the default test user.
- Do not commit `.env` to source control.
- Use HTTPS.
- Restrict database network access.
- Configure proper logging and monitoring.
- Use database migrations instead of automatic table initialization.
- Add rate limiting to the login endpoint.
- Configure CORS according to the client application.