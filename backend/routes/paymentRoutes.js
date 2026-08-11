import express from "express";

import {
  initializePayment,
  verifyPayment,
} from "../controllers/paymentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// Initialize payment
router.post(
  "/initialize",
  protect,
  initializePayment
);


// Verify payment
router.get(
  "/verify/:reference",
  protect,
  verifyPayment
);


export default router;