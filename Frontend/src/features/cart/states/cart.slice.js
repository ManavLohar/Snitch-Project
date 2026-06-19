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
    insertItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { setCart, insertItem } = cartSlice.actions;
export default cartSlice.reducer;
