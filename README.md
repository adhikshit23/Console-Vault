# ConsoleVault – React version

A React single-page app that lives next to your original HTML/CSS/JS site. **Nothing outside this
`react-app/` folder was changed.** The original CSS files are copied unmodified into `src/styles/`
and the original markup is reused, so every page looks the same as the static version.

## Run
```bash
cd react-app
npm install
npm run dev        # development
npm run build      # production build -> dist/ (works on any static host, uses #/routes)
```

## Where each required topic lives
| Topic | Where |
|---|---|
| HTML / CSS / DOM / JS / React / Router basics | whole app; original markup + CSS reused (`src/content`, `src/styles`) |
| Multi-page SPA, navigation layout, page structure | `src/App.jsx` (routes), `components/Layout.jsx` (header, search/account/cart overlays, footer), `components/PageShell.jsx` |
| Routing | React Router `HashRouter`, nested `Layout` route, `RequireAuth` guard (`/orders`, `/account`, `/settings`), `useSearchParams` for `?category=` & `?highlight=`, 404 route |
| Context API – global vs local state | `context/AuthContext.jsx` (user, login/signup/logout), `context/UIContext.jsx` (open overlay + toast). Form fields/filters stay local state |
| Redux Toolkit | `store/` – `cartSlice`, `ordersSlice`, `catalogSlice`; cart/orders persist to the same localStorage keys as the old site |
| Async state, loading/error handling | `store/catalogSlice.js` (`createAsyncThunk`, idle/loading/succeeded/failed) + `components/AsyncBoundary.jsx` (spinner, error, retry). Add `?failcatalog=1` to the URL to see the error state |
| Form handling & validation | `hooks/useForm.js` + `utils/validators.js` (required, email, minLength, matches); reusable `components/FormField.jsx`; used by Login/Sign-up, Contact, Checkout, Settings |
| Mini project (shopping cart) | cart panel, add/remove/qty, checkout, order confirmation, order history |

## Notes
- `pages/Rentals.jsx` runs the original rentals widget logic as-is inside the route (not yet rewritten as components).
- Home/About/legal pages render the original HTML via `components/Html.jsx`, which also wires their Add-to-Cart buttons to Redux.
- `login.css` and `mainpage.css` both style `html/body`, so each layout injects only its own stylesheet (`hooks/useStyles.js`).
