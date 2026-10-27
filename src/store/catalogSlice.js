import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async state: fetching the catalog is a thunk with idle/loading/succeeded/failed
// states. The data module is loaded with a dynamic import after a short delay, which
// stands in for a real API call. Swap the body for fetch("/api/products") later.
// Add ?failcatalog=1 to the URL to see the error + retry UI.
export const fetchCatalog = createAsyncThunk("catalog/fetch", async () => {
  await new Promise((r) => setTimeout(r, 500));
  if (window.location.href.includes("failcatalog=1")) {
    throw new Error("Could not reach the product server.");
  }
  const mod = await import("../data/catalog.js");
  return mod.default;
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const selectCatalog = (s) => s.catalog;
export default catalogSlice.reducer;
