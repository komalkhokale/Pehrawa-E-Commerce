import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/add/:productId/:variantId", authenticateUser, addToWishlist);
router.get("/", authenticateUser, getWishlist);
router.delete(
  "/remove/:productId/:variantId",
  authenticateUser,
  removeFromWishlist
);

export default router;