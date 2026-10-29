import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem, selectCartItems } from "../store/cartSlice";
import { makeProduct } from "../utils/product";
import { useUI } from "../context/UIContext";

const ADD_SELECTOR = ".console-add-btn, .pc-hw-add-btn, .game-add-btn";

export default function Html({ html, className, as: Tag = "div", style }) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const { showMessage } = useUI();
  const navigate = useNavigate();

  const productFrom = (btn) => {
    const card = btn.closest(".console-card, .game-card, .product-card");
    const name = card?.querySelector("h3, h2")?.textContent.trim();
    if (!name) return null;
    const price = card.querySelector(".console-price, .pc-hw-price, .price")?.textContent.trim() || "₹0";
    const image = card.querySelector("img")?.getAttribute("src") || "";
    const category = btn.classList.contains("console-add-btn") ? "console" : btn.classList.contains("pc-hw-add-btn") ? "pc" : "game";
    return makeProduct({ title: name, price, image }, category);
  };

  const onClick = (e) => {
    const add = e.target.closest(ADD_SELECTOR);
    if (add) {
      e.preventDefault();
      const product = productFrom(add);
      if (!product) return;
      const exists = items.some((i) => i.id === product.id);
      dispatch(addItem(product));
      showMessage(exists ? `Added another "${product.name}" to cart` : `Added "${product.name}" to cart`, "success");
      return;
    }
    if (e.target.closest("#getStartedBtn")) {
      document.getElementById("authSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const link = e.target.closest("a[href^='#']");
    if (link) {
      const href = link.getAttribute("href");
      if (href.startsWith("#/")) {
        e.preventDefault();
        navigate(href.slice(1));
      } else if (href.length > 1) {
        e.preventDefault();
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll(ADD_SELECTOR).forEach((btn) => {
      const p = productFrom(btn);
      if (!p) return;
      const inCart = items.some((i) => i.id === p.id);
      btn.textContent = inCart ? "✓ Added to Cart" : "Add to Cart";
      btn.classList.toggle("added", inCart);
    });
  }, [items, html]);

  return <Tag ref={ref} className={className} style={style} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
