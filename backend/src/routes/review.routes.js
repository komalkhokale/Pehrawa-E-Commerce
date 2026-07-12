import express from "express";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Product ke saare reviews
router.get("/:productId", getProductReviews);

// Review add
router.post("/:productId", authenticateUser, addReview);

// Review update
router.patch("/:reviewId", authenticateUser, updateReview);

// Review delete
router.delete("/:reviewId", authenticateUser, deleteReview);

export default router;