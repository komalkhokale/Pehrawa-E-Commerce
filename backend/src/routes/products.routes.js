import express from "express";
import multer from "multer";

import { authenticateSeller } from "../middlewares/auth.middleware.js";

import {
  createProduct,
  getAllProducts,
  getSellerProducts,
  getProductDetails,
  addProductVariant,
  deleteProduct,
 updateProduct,
 deleteProductVariant,
 updateProductVariant,
 getSellerDashboard
} from "../controllers/product.controller.js";

import {
  createProductValidator,
  addProductVariantValidator,
} from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

// Create Product
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),   // 👈 ADD THIS
  createProductValidator,
  createProduct
);

// Seller Products
router.get("/seller", authenticateSeller, getSellerProducts);

router.get(
  "/seller/dashboard",
  authenticateSeller,
  getSellerDashboard
);

// All Products
router.get("/", getAllProducts);

// Product Details
router.get("/detail/:id", getProductDetails);

// Add Variant
router.post(
  "/:productId/variants",
  authenticateSeller,
  upload.array("images", 7),
  addProductVariantValidator,
  addProductVariant
);

router.patch("/:productId", authenticateSeller, upload.array("images", 7), updateProduct);
router.delete("/:productId", authenticateSeller, deleteProduct);

router.patch(
  "/:productId/variants/:variantId",
  authenticateSeller,
  upload.array("images", 7),
  updateProductVariant
);

router.delete(
  "/:productId/variants/:variantId",
  authenticateSeller,
  deleteProductVariant
);



export default router;