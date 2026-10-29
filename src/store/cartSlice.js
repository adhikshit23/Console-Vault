import { createSlice } from "@reduxjs/toolkit";

export const CART_KEY = "consolevault_cart";
export const SAVED_CART_KEY = "consolevault_saved_cart";

const loadFromStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: loadFromStorage(CART_KEY),
    savedItems: loadFromStorage(SAVED_CART_KEY),
    recentlyRemoved: null,
  },

  reducers: {
    // Add product to cart
    addItem(state, { payload }) {
      const existing = state.items.find(
        (item) => item.id === payload.id
      );

      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        state.items.push({ ...payload, qty: 1 });
      }
    },

    // Increase quantity
    increase(state, { payload: id }) {
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.qty = (item.qty || 1) + 1;
      }
    },

    // Decrease quantity
    decrease(state, { payload: id }) {
      const item = state.items.find((item) => item.id === id);

      if (!item) return;

      item.qty = (item.qty || 1) - 1;

      if (item.qty <= 0) {
        state.recentlyRemoved = { ...item, qty: 1 };
        state.items = state.items.filter(
          (item) => item.id !== id
        );
      }
    },

    // Remove product and allow undo
    removeItem(state, { payload: id }) {
      const item = state.items.find((item) => item.id === id);

      if (item) {
        state.recentlyRemoved = { ...item };
        state.items = state.items.filter(
          (item) => item.id !== id
        );
      }
    },

    // Restore last removed product
    restoreLastRemoved(state) {
      if (!state.recentlyRemoved) return;

      const removed = state.recentlyRemoved;
      const existing = state.items.find(
        (item) => item.id === removed.id
      );

      if (existing) {
        existing.qty = (existing.qty || 1) + (removed.qty || 1);
      } else {
        state.items.push(removed);
      }

      state.recentlyRemoved = null;
    },

    // Move product from cart to Save for Later
    saveForLater(state, { payload: id }) {
      const item = state.items.find((item) => item.id === id);

      if (!item) return;

      const alreadySaved = state.savedItems.find(
        (saved) => saved.id === id
      );

      if (alreadySaved) {
        alreadySaved.qty =
          (alreadySaved.qty || 1) + (item.qty || 1);
      } else {
        state.savedItems.push({ ...item });
      }

      state.items = state.items.filter(
        (item) => item.id !== id
      );
    },

    // Move saved product back to cart
    moveToCart(state, { payload: id }) {
      const item = state.savedItems.find(
        (saved) => saved.id === id
      );

      if (!item) return;

      const existing = state.items.find(
        (cartItem) => cartItem.id === id
      );

      if (existing) {
        existing.qty =
          (existing.qty || 1) + (item.qty || 1);
      } else {
        state.items.push({ ...item });
      }

      state.savedItems = state.savedItems.filter(
        (saved) => saved.id !== id
      );
    },

    // Permanently remove a saved item
    removeSavedItem(state, { payload: id }) {
      state.savedItems = state.savedItems.filter(
        (item) => item.id !== id
      );
    },

    // Clear cart without deleting saved items
    clearCart(state) {
      state.items = [];
    },

    // Clear undo history
    clearRecentlyRemoved(state) {
      state.recentlyRemoved = null;
    },
  },
});

export const {
  addItem,
  increase,
  decrease,
  removeItem,
  restoreLastRemoved,
  saveForLater,
  moveToCart,
  removeSavedItem,
  clearCart,
  clearRecentlyRemoved,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectSavedItems = (state) =>
  state.cart.savedItems;

export const selectRecentlyRemoved = (state) =>
  state.cart.recentlyRemoved;

export const selectCartCount = (state) =>
  state.cart.items.reduce(
    (count, item) => count + (item.qty || 1),
    0
  );

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (item.qty || 1),
    0
  );

export default cartSlice.reducer;