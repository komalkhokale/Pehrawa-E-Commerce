import express from "express";
import {
  authenticateSeller,
  authenticateUser,
} from "../middlewares/auth.middleware.js";
import {
  validateAddToCart,
  validateIncrementCartItemQuantity,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeCartItem,
  createOrderController,
  verifyOrderController,
  getMyOrdersController,
  getSellerOrdersController,
  getSellerAnalyticsController,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

router.get("/", authenticateUser, getCart);

router.patch(
  "/quantity/increment/:productId/:variantId",
  authenticateUser,
  validateIncrementCartItemQuantity,
  incrementCartItemQuantity,
);

router.patch(
  "/quantity/decrement/:productId/:variantId",
  authenticateUser,
  decrementCartItemQuantity,
);

router.delete(
  "/remove/:productId/:variantId",
  authenticateUser,
  removeCartItem,
);

router.post("/payment/create/order", authenticateUser, createOrderController);

router.post("/payment/verify/order", authenticateUser, verifyOrderController);

router.get("/orders/my", authenticateUser, getMyOrdersController);

router.get("/orders/seller", authenticateSeller, getSellerOrdersController);

router.get(
  "/analytics/seller",
  authenticateSeller,
  getSellerAnalyticsController,
);

export default router;
