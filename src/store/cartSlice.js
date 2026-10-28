import { createSlice } from "@reduxjs/toolkit";

export const CART_KEY = "consolevault_cart";

const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: load() },
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find((i) => i.id === payload.id);
      if (existing) existing.qty = (existing.qty || 1) + 1;
      else state.items.push({ ...payload, qty: 1 });
    },
    increase(state, { payload: id }) {
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = (item.qty || 1) + 1;
    },
    decrease(state, { payload: id }) {
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      item.qty = (item.qty || 1) - 1;
      if (item.qty <= 0) state.items = state.items.filter((i) => i.id !== id);
    },
    removeItem(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, increase, decrease, removeItem, clearCart } = cartSlice.actions;

export const selectCartItems = (s) => s.cart.items;
export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + (i.qty || 1), 0);
export const selectCartTotal = (s) =>
  s.cart.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.qty || 1), 0);

export default cartSlice.reducer;
