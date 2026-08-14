import express from "express";
import cors from "cors";
import "dotenv/config";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pool from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());

console.log(
  "Paystack key loaded:",
  Boolean(process.env.PAYSTACK_SECRET_KEY)
);

console.log(
  "JWT secret loaded:",
  Boolean(process.env.JWT_SECRET)
);



app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.use("/api/payments", paymentRoutes);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Kitchen World API is running");
});


app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API test working",
  });
});


// PRODUCT ROUTES
app.use("/api/products", productRoutes);

// AUTH ROUTES
app.use("/api/auth", authRoutes);


app.use("/api/orders", orderRoutes); 





// START SERVER
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