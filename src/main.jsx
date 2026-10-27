import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import App from "./App";
import "./styles/forms.css";

// HashRouter (#/consoles ...) so the built app works on any static host without server rewrites.
// StrictMode is intentionally off: the Rentals island attaches DOM listeners once on mount.
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HashRouter>
      <AuthProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </AuthProvider>
    </HashRouter>
  </Provider>
);
