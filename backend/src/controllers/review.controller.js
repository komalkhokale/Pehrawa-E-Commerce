import mongoose from "mongoose";
import reviewModel from "../models/review.model.js";
import productModel from "../models/product.model.js";
import paymentModel from "../models/payment.model.js";

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment?.trim() || comment.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at least 3 characters",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Buyer ne product purchase kiya hai ya nahi
    const purchasedProduct = await paymentModel.exists({
      user: req.user._id,
      status: "paid",
      "orderItems.productId": productId,
    });

    if (!purchasedProduct) {
      return res.status(403).json({
        success: false,
        message: "You can review only purchased products",
      });
    }

    const existingReview = await reviewModel.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await reviewModel.create({
      user: req.user._id,
      product: productId,
      rating: numericRating,
      comment: comment.trim(),
    });

    await review.populate({
      path: "user",
      select: "fullname",
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log("Add review error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const reviews = await reviewModel
      .find({
        product: productId,
      })
      .populate({
        path: "user",
        select: "fullname",
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0,
          ) / totalReviews
        : 0;

    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      ratingBreakdown[review.rating] =
        Number(ratingBreakdown[review.rating] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      ratingBreakdown,
      reviews,
    });
  } catch (error) {
    console.log("Get product reviews error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not allowed",
      });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = numericRating;
    }

    if (comment !== undefined) {
      if (!comment?.trim() || comment.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Comment must be at least 3 characters",
        });
      }

      review.comment = comment.trim();
    }

    await review.save();

    await review.populate({
      path: "user",
      select: "fullname",
    });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.log("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await reviewModel.findOneAndDelete({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not allowed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};