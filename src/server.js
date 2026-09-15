require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const { z } = require("zod");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

/*
 * Validation schemas
 */
const loginSchema = z
  .object({
    username: z.string().min(1, "username is mandatory"),
    password: z.string().min(1, "password is mandatory")
  })
  .strict();

const orderSchema = z
  .object({
    orderId: z
      .number({
        required_error: "orderId is mandatory",
        invalid_type_error: "orderId must be an integer"
      })
      .int("orderId must be an integer"),

    customerName: z
      .string({
        required_error: "customerName is mandatory",
        invalid_type_error: "customerName must be a string"
      })
      .min(1, "customerName cannot be empty"),

    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"], {
      required_error: "status is mandatory",
      invalid_type_error:
        "status must be PENDING, CONFIRMED, or CANCELLED"
    }),

    amount: z
      .number({
        required_error: "amount is mandatory",
        invalid_type_error: "amount must be a number"
      })
      .positive("amount must be greater than 0")
  })
  .strict();

/*
 * Database initialization
 */
async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
      amount NUMERIC(12, 2) NOT NULL
        CHECK (amount > 0),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create the requested example login account.
  const passwordHash = await bcrypt.hash("Password123", 12);

  await pool.query(
    `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
    `,
    ["testuser", passwordHash]
  );

  // Create the example order.
  await pool.query(
    `
      INSERT INTO orders (
        order_id,
        customer_name,
        status,
        amount
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (order_id) DO NOTHING
    `,
    [1001, "John", "CONFIRMED", 2500]
  );

  console.log("Database initialized");
}

/*
 * Helper functions
 */
function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );
}

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: "Authorization header is required"
    });
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({
      error: "Authorization header must use: Bearer <token>"
    });
  }

  try {
    req.user = jwt.verify(parts[1], process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token is invalid or expired"
    });
  }
}

function formatValidationErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

function mapOrder(row) {
  return {
    orderId: row.order_id,
    customerName: row.customer_name,
    status: row.status,
    amount: Number(row.amount)
  };
}

/*
 * Health endpoint
 */
app.get("/api/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "UP",
      database: "UP"
    });
  } catch (error) {
    next(error);
  }
});

/*
 * POST /api/login
 *
 * Request:
 * {
 *   "username": "testuser",
 *   "password": "Password123"
 * }
 */
app.post("/api/login", async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationErrors(validation.error)
      });
    }

    const { username, password } = validation.data;

    const result = await pool.query(
      `
        SELECT id, username, password_hash
        FROM users
        WHERE username = $1
      `,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    const token = createToken(user);

    return res.json({
      token
    });
  } catch (error) {
    next(error);
  }
});

/*
 * GET /api/orders
 *
 * Required header:
 * Authorization: Bearer <token>
 */
app.get("/api/orders", authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT order_id, customer_name, status, amount
      FROM orders
      ORDER BY order_id
    `);

    return res.json(result.rows.map(mapOrder));
  } catch (error) {
    next(error);
  }
});

/*
 * GET /api/orders/:orderId
 */
app.get("/api/orders/:orderId", authenticateToken, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({
        error: "orderId must be an integer"
      });
    }

    const result = await pool.query(
      `
        SELECT order_id, customer_name, status, amount
        FROM orders
        WHERE order_id = $1
      `,
      [orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    return res.json(mapOrder(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

/*
 * POST /api/orders
 *
 * Request:
 * {
 *   "orderId": 1001,
 *   "customerName": "John",
 *   "status": "CONFIRMED",
 *   "amount": 2500
 * }
 */
app.post("/api/orders", authenticateToken, async (req, res, next) => {
  try {
    const validation = orderSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationErrors(validation.error)
      });
    }

    const { orderId, customerName, status, amount } = validation.data;

    const result = await pool.query(
      `
        INSERT INTO orders (
          order_id,
          customer_name,
          status,
          amount
        )
        VALUES ($1, $2, $3, $4)
        RETURNING order_id, customer_name, status, amount
      `,
      [orderId, customerName, status, amount]
    );

    return res.status(201).json(mapOrder(result.rows[0]));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "An order with this orderId already exists"
      });
    }

    next(error);
  }
});

/*
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found"
  });
});

/*
 * General error handler
 */
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error"
  });
});

/*
 * Start application
 */
async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    await initializeDatabase();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Orders API is running on port ${port}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log("Shutting down...");
  await pool.end();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();