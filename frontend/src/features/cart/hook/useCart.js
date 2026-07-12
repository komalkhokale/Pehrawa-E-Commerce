import {
  addItem,
  getCart,
  incrementCartItemApi,
  decrementCartItemApi,
  removeCartItemApi,
  createCartOrder,
  verifyCartOrder,
  getMyOrders,
} from "../service/cart.api.js";

import { useDispatch } from "react-redux";

import { setCart } from "../state/cart.slice.js";

export const useCart = () => {
  const dispatch = useDispatch();

  async function handleAddItem({ productId, variantId }) {
    try {
      const data = await addItem({ productId, variantId });

      // Product add hone ke baad updated cart fetch karo
      const updatedCart = await getCart();

      dispatch(setCart(updatedCart.cart));

      return data;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);

      throw error;
    }
  }

  async function handleGetCart() {
    try {
      const data = await getCart();

      console.log("Complete cart response:", data);
      console.log("Cart received:", data.cart);
      console.log("Cart items:", data.cart?.items);

      dispatch(
        setCart(
          data.cart || {
            items: [],
            totalPrice: 0,
            currency: "INR",
          },
        ),
      );

      return data;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);

      dispatch(
        setCart({
          items: [],
          totalPrice: 0,
          currency: "INR",
        }),
      );

      throw error;
    }
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    try {
      await incrementCartItemApi({
        productId,
        variantId,
      });

      const data = await getCart();

      dispatch(setCart(data.cart));

      return data;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);

      throw error;
    }
  }

  async function handleDecrementCartItem({ productId, variantId }) {
    try {
      await decrementCartItemApi({
        productId,
        variantId,
      });

      const data = await getCart();

      dispatch(setCart(data.cart));

      return data;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);

      throw error;
    }
  }

  async function handleRemoveCartItem({ productId, variantId }) {
    try {
      await removeCartItemApi({
        productId,
        variantId,
      });

      const data = await getCart();

      dispatch(setCart(data.cart));

      return data;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);

      throw error;
    }
  }

  async function handleCreateCartOrder() {
    const data = await createCartOrder();
    return data.order;
  }

  async function handleVerifyCartOrder({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) {
    try {
      const data = await verifyCartOrder({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      return data;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);

      throw error;
    }
  }

  async function handleGetMyOrders() {
  try {
    const data = await getMyOrders();

    return data.orders || [];
  } catch (error) {
    console.log(
      error.response?.data?.message ||
        error.message
    );

    throw error;
  }
}

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
    handleCreateCartOrder,
    handleVerifyCartOrder,
    handleGetMyOrders
  };
};
