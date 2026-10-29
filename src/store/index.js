import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CART_KEY , SAVED_CART_KEY} from "./cartSlice";
import catalogReducer from "./catalogSlice";
import ordersReducer, { ORDERS_KEY } from "./ordersSlice";

export const store = configureStore({
  reducer: { cart: cartReducer, catalog: catalogReducer, orders: ordersReducer },
});

// Persist cart + orders using the same keys as the original static pages.
let last = {
  cart: null,
  saved: null,
  orders: null,
};

store.subscribe(() => {
  const { cart, orders } = store.getState();

  try {
    if (cart.items !== last.cart) {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart.items)
      );
    }

    if (cart.savedItems !== last.saved) {
      localStorage.setItem(
        SAVED_CART_KEY,
        JSON.stringify(cart.savedItems)
      );
    }

    if (orders.list !== last.orders) {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders.list)
      );
    }
  } catch {
    // Keep the application working if storage is unavailable
  }

  last = {
    cart: cart.items,
    saved: cart.savedItems,
    orders: orders.list,
  };
});
