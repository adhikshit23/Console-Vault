import { createSlice } from "@reduxjs/toolkit";

export const ORDERS_KEY = "consolevault_orders";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: load() },
  reducers: {
    orderPlaced(state, { payload }) {
      state.list.unshift(payload);
    },
  },
});

export const { orderPlaced } = ordersSlice.actions;
export default ordersSlice.reducer;
