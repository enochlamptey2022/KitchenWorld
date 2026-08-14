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


// ================================
// CORS
// ================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://kitchen-world-lac.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests with no origin
      // e.g. browser address bar / Postman
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


// ================================
// MIDDLEWARE
// ================================

app.use(express.json());


// ================================
// HOME
// ================================

app.get("/", (req, res) => {
  res.send("Kitchen World API is running");
});


// ================================
// ROUTES
// ================================

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);


// ================================
// START SERVER
// ================================

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