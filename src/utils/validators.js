export const required = (label = "This field") => (v) =>
  String(v ?? "").trim() ? undefined : `${label} is required.`;

export const email = () => (v) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()) ? undefined : "Enter a valid email address.";

export const minLength = (n, label = "This field") => (v) =>
  !v || String(v).length >= n ? undefined : `${label} must be at least ${n} characters.`;

export const matches = (otherField, message) => (v, all) =>
  v === all[otherField] ? undefined : message;
