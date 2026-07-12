import { useDispatch } from "react-redux";
import {
  addToWishlistApi,
  getWishlistApi,
  removeWishlistApi,
} from "../services/wishlist.api.js";

import { setWishlist } from "../state/wishlist.slice";

export const useWishlist = () => {
  const dispatch = useDispatch();

async function handleAddWishlist({ productId, variantId }) {
  try {
    await addToWishlistApi({ productId, variantId });

    const data = await getWishlistApi();
    dispatch(setWishlist(data.wishlist.items));
  } catch (error) {
    console.log("Wishlist error:", error.response?.data);
  }
}

  async function handleGetWishlist() {
    const data = await getWishlistApi();
    dispatch(setWishlist(data.wishlist.items));
  }

  async function handleRemoveWishlist({ productId, variantId }) {
    await removeWishlistApi({ productId, variantId });

    const data = await getWishlistApi();
    dispatch(setWishlist(data.wishlist.items));
  }

  return {
    handleAddWishlist,
    handleGetWishlist,
    handleRemoveWishlist,
  };
};