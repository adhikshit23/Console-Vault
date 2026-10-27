import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CART_KEY } from "./cartSlice";
import catalogReducer from "./catalogSlice";
import ordersReducer, { ORDERS_KEY } from "./ordersSlice";

export const store = configureStore({
  reducer: { cart: cartReducer, catalog: catalogReducer, orders: ordersReducer },
});

// Persist cart + orders using the same keys as the original static pages.
let last = {};
store.subscribe(() => {
  const { cart, orders } = store.getState();
  try {
    if (cart.items !== last.cart) localStorage.setItem(CART_KEY, JSON.stringify(cart.items));
    if (orders.list !== last.orders) localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.list));
  } catch {
    /* storage unavailable – keep working in memory */
  }
  last = { cart: cart.items, orders: orders.list };
});
