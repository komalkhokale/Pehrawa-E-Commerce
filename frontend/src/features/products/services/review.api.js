import axios from "axios";

const reviewApiInstance = axios.create({
  baseURL: "https://pehrawa.onrender.com/api/reviews",
  withCredentials: true,
});

export async function getProductReviews(productId) {
  const response = await reviewApiInstance.get(`/${productId}`);
  return response.data;
}

export async function addReview(productId, reviewData) {
  const response = await reviewApiInstance.post(`/${productId}`, reviewData);
  return response.data;
}

export async function updateReview(reviewId, reviewData) {
  const response = await reviewApiInstance.patch(`/${reviewId}`, reviewData);
  return response.data;
}

export async function deleteReview(reviewId) {
  const response = await reviewApiInstance.delete(`/${reviewId}`);
  return response.data;
}