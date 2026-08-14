import express from "express";
import cors from "cors";
import "dotenv/config";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import pool from "./config/db.js";


const app = express();

const PORT = process.env.PORT || 5000;


// =========================
// CORS
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];


app.use(
  cors({
    origin: (origin, callback) => {

      // Allow requests with no origin
      // e.g. Postman / Thunder Client / server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// =========================
// JSON MIDDLEWARE
// =========================

app.use(express.json());


// =========================
// ENVIRONMENT CHECKS
// =========================

console.log(
  "Paystack key loaded:",
  Boolean(process.env.PAYSTACK_SECRET_KEY)
);

console.log(
  "JWT secret loaded:",
  Boolean(process.env.JWT_SECRET)
);


// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
  res.send(
    "Kitchen World API is running"
  );
});


// =========================
// API ROUTES
// =========================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);


// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


// =========================
// START SERVER
// =========================

app.listen(PORT, async () => {

  try {

    const result = await pool.query(
      "SELECT NOW()"
    );

    console.log(
      "Database connected:",
      result.rows[0]
    );

    console.log(
      `Server running on port ${PORT}`
    );

  } catch (error) {

    console.error(
      "Database connection failed:",
      error.message
    );

  }

});