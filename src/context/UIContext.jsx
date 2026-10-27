import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Global (Context) UI state: which overlay is open + the toast message.
// Local state (form fields, filters) stays inside the components that own it.
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [overlay, setOverlay] = useState(null); // "search" | "account" | "cart" | null
  const [toast, setToast] = useState({ text: "", type: "" });
  const timer = useRef();

  const showMessage = useCallback((text, type = "success") => {
    clearTimeout(timer.current);
    setToast({ text, type });
    timer.current = setTimeout(() => setToast({ text: "", type: "" }), 2500);
  }, []);

  const open = useCallback((name) => setOverlay(name), []);
  const close = useCallback(() => setOverlay(null), []);
  const toggle = useCallback((name) => setOverlay((o) => (o === name ? null : name)), []);

  // Same behaviour as the original pages: body scroll locked while an overlay is open, Esc closes.
  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
  }, [overlay]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOverlay(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ overlay, open, close, toggle, toast, showMessage }),
    [overlay, open, close, toggle, toast, showMessage]
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
