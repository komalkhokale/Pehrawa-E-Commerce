import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../services/review.api.js";

export const useReview = () => {
  async function handleGetProductReviews(productId) {
    const data = await getProductReviews(productId);

    return data;
  }

  async function handleAddReview(productId, reviewData) {
    const data = await addReview(productId, reviewData);

    return data;
  }

  async function handleUpdateReview(reviewId, reviewData) {
    const data = await updateReview(reviewId, reviewData);

    return data;
  }

  async function handleDeleteReview(reviewId) {
    const data = await deleteReview(reviewId);

    return data;
  }

  return {
    handleGetProductReviews,
    handleAddReview,
    handleUpdateReview,
    handleDeleteReview,
  };
};