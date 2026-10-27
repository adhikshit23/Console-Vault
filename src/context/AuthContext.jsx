import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Global (Context) state: who is logged in. Uses the same localStorage keys as login.js
// so accounts created on the old pages keep working.
// NOTE: passwords are plain text in localStorage – fine for a front-end-only prototype,
// never for a real app.
const USERS_KEY = "playboy_users";
const CURRENT_KEY = "playboy_current_user";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(CURRENT_KEY, null));

  const login = useCallback((email, password) => {
    const account = read(USERS_KEY, []).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!account) return { ok: false, error: "No account found with that email. Try signing up instead." };
    if (account.password !== password) return { ok: false, error: "Incorrect password. Please try again." };
    const current = { name: account.name, email: account.email };
    write(CURRENT_KEY, current);
    setUser(current);
    return { ok: true };
  }, []);

  const signup = useCallback((name, email, password) => {
    const users = read(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists. Try logging in." };
    }
    users.push({ name, email, password });
    write(USERS_KEY, users);
    const current = { name, email };
    write(CURRENT_KEY, current);
    setUser(current);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    if (!user) return; // Prevent multiple / redundant logout calls
    try {
      localStorage.removeItem(CURRENT_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, [user]);

  const updateName = useCallback((name) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, name };
      write(CURRENT_KEY, next);
      const users = read(USERS_KEY, []);
      const existing = users.find((u) => u.email === prev.email);
      if (existing) {
        existing.name = name;
        write(USERS_KEY, users);
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ user, login, signup, logout, updateName }), [user, login, signup, logout, updateName]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
