import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    insertItems: (state, action) => {
      state.items.push(action.payload);
    },
    insertItem: (state, action) => {
      state.items[0].push(action.payload);
    },
    incrementCartitem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items[0] = state.items[0].map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    },
    decrementCartitem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items[0] = state.items[0].map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
    },
    removeItem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items[0] = state.items[0].filter(
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
