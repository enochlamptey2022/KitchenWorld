import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();


// GET ALL PRODUCTS
router.get("/", getProducts);


// GET ONE PRODUCT
router.get("/:id", getProductById);


// CREATE PRODUCT
router.post("/", createProduct);


// UPDATE PRODUCT
router.put("/:id", updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);


export default router;