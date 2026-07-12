import axios from "axios";

const wishlistApi = axios.create({
  baseURL: "/api/wishlist",
  withCredentials: true,
});

export const addToWishlistApi = async ({ productId, variantId }) => {
  const { data } = await wishlistApi.post(
    `/add/${productId}/${variantId}`
  );

  return data;
};

export const getWishlistApi = async () => {
  const { data } = await wishlistApi.get("/");

  return data;
};

export const removeWishlistApi = async ({ productId, variantId }) => {
  const { data } = await wishlistApi.delete(
    `/remove/${productId}/${variantId}`
  );

  return data;
};