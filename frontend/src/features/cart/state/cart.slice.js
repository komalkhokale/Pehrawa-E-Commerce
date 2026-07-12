import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalPrice: 0,
  currency: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload?.items || [];
      state.totalPrice = action.payload?.totalPrice || 0;
      state.currency = action.payload?.currency || null;
    },

    addItem: (state, action) => {
      state.items.push(action.payload);
    },

    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (item) =>
          item.product?._id === productId &&
          item.variant?._id === variantId
      );

      if (item) {
        item.quantity += 1;

        item.total =
          item.quantity * Number(item.variant?.price?.amount || 0);

        state.totalPrice = state.items.reduce(
          (sum, cartItem) => sum + Number(cartItem.total || 0),
          0
        );
      }
    },

    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      const itemIndex = state.items.findIndex(
        (item) =>
          item.product?._id === productId &&
          item.variant?._id === variantId
      );

      if (itemIndex === -1) return;

      if (state.items[itemIndex].quantity === 1) {
        state.items.splice(itemIndex, 1);
      } else {
        state.items[itemIndex].quantity -= 1;

        state.items[itemIndex].total =
          state.items[itemIndex].quantity *
          Number(state.items[itemIndex].variant?.price?.amount || 0);
      }

      state.totalPrice = state.items.reduce(
        (sum, cartItem) => sum + Number(cartItem.total || 0),
        0
      );

      if (state.items.length === 0) {
        state.currency = null;
      }
    },

    removeCartItemFromState: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.product?._id === productId &&
            item.variant?._id === variantId
          )
      );

      state.totalPrice = state.items.reduce(
        (sum, cartItem) => sum + Number(cartItem.total || 0),
        0
      );

      if (state.items.length === 0) {
        state.currency = null;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.currency = null;
    },
  },
});

export const {
  setCart,
  addItem,
  incrementCartItem,
  decrementCartItem,
  removeCartItemFromState,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;