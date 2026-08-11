import pool from "../config/db.js";


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ========================================
// GET ONE PRODUCT
// ========================================

const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      stock,
      image,
      rating,
      description,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
        (
          name,
          price,
          category,
          stock,
          image,
          rating,
          description
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        price,
        category,
        stock ?? 0,
        image || null,
        rating ?? 0,
        description || "",
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      price,
      category,
      stock,
      image,
      rating,
      description,
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET
         name = $1,
         price = $2,
         category = $3,
         stock = $4,
         image = $5,
         rating = $6,
         description = $7
       WHERE id = $8
       RETURNING *`,
      [
        name,
        price,
        category,
        stock,
        image,
        rating,
        description,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};