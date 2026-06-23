import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalPrice: null,
  currency: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      const { items, totalPrice, currency } = action.payload;
      state.items = items;
      state.totalPrice = totalPrice;
      state.currency = currency;
    },
    insertItems: (state, action) => {
      state.items.push(action.payload);
    },
    insertItem: (state, action) => {
      state.items.push(action.payload);
    },
    incrementCartitem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    },
    decrementCartitem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
    },
    removeItem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (item) => item.product._id !== productId || item.variant !== variantId,
      );
    },
  },
});

export const {
  setCart,
  insertItems,
  insertItem,
  incrementCartitem,
  decrementCartitem,
  removeItem,
} = cartSlice.actions;
export default cartSlice.reducer;
