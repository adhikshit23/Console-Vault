export const makeProduct = ({ title, price, image }, category = "game") => ({
  id: `${category}-${title}-${price}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: title,
  priceText: price,
  price: Number(String(price).replace(/[^\d]/g, "")) || 0,
  image,
});

export const rupees = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

export const CATEGORY_ROUTE = {
  action: "/games",
  adventure: "/games",
  rpg: "/games",
  console: "/consoles",
  accessory: "/accessories",
  pc: "/pc-components",
};
