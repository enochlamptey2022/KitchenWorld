import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";


// ==============================
// REGISTER USER
// ==============================

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    // Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message:
          "Full name, email and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message:
          "A user with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user in PostgreSQL
    const result = await pool.query(
      `INSERT INTO users
        (full_name, email, password)
       VALUES ($1, $2, $3)
       RETURNING
         id,
         full_name,
         email,
         created_at`,
      [
        fullName,
        email,
        hashedPassword,
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==============================
// LOGIN USER
// ==============================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare entered password with hashed password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    // Check password
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // ==============================
    // CREATE JWT TOKEN
    // ==============================

   const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);


    // ==============================
    // SEND LOGIN RESPONSE
    // ==============================

    res.status(200).json({
      message: "Login successful",

      token,

    user: {
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  role: user.role,
},
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==============================
// EXPORT
// ==============================
export {
  registerUser,
  loginUser,
  getMe,
};