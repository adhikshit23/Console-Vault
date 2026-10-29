import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectCartItems } from "../store/cartSlice";
import { makeProduct } from "../utils/product";
import { useUI } from "../context/UIContext";

function ProductCard({ product, index, highlight }) {
  const dispatch = useDispatch();
  const { showMessage } = useUI();
  const item = makeProduct(product, "game");
  const inCart = useSelector((s) => selectCartItems(s).some((i) => i.id === item.id));

  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const t = setTimeout(() => {
      el?.classList.add("is-visible");
      setTimeout(() => el && (el.style.transitionDelay = ""), 500);
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const add = () => {
    dispatch(addItem(item));
    showMessage(inCart ? `Added another "${item.name}" to cart` : `Added "${item.name}" to cart`, "success");
  };

  return (
    <article
      ref={ref}
      className={`game-card reveal${highlight ? " search-highlight" : ""}`}
      style={{ transitionDelay: `${(index % 4) * 60}ms` }}
      data-title={product.title}
    >
      <img src={product.image} alt={product.title} />
      <div className="game-info">
        <h2>{product.title}</h2>
        <div className="price">{product.price}</div>
        <button type="button" className={`game-add-btn${inCart ? " added" : ""}`} onClick={add}>
          {inCart ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default memo(ProductCard);
