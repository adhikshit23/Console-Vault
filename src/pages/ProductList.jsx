import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCatalog, selectCatalog } from "../store/catalogSlice";
import ProductCard from "../components/ProductCard";
import AsyncBoundary from "../components/AsyncBoundary";

export default function ProductList({ categories, filters, names, subtitle }) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectCatalog);
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "all";
  const highlight = params.get("highlight");

  useEffect(() => {
    if (status === "idle") dispatch(fetchCatalog());
  }, [status, dispatch]);

  const list = useMemo(
    () => items.filter((p) => categories.includes(p.category) && (active === "all" || p.category === active)),
    [items, categories, active]
  );

  useEffect(() => {
    if (!highlight || status !== "succeeded") return undefined;
    const t = setTimeout(() => {
      const card = Array.from(document.querySelectorAll(".game-card")).find(
        (el) => el.dataset.title?.toLowerCase() === highlight.toLowerCase()
      );
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("search-highlight");
        setTimeout(() => card.classList.remove("search-highlight"), 2800);
      }
      const next = new URLSearchParams(params);
      next.delete("highlight");
      setParams(next, { replace: true });
    }, 450);
    return () => clearTimeout(t);
  }, [highlight, status]);

  return (
    <main className="page-main">
      <div className="page-hero">
        <h1 id="pageTitle">{names[active] || names.all}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="filter-nav" id="filterNav">
        {[{ cat: "all", label: names.all }, ...filters].map((f) => (
          <button
            key={f.cat}
            type="button"
            className={`filter-btn${active === f.cat ? " active" : ""}`}
            data-cat={f.cat}
            onClick={() => setParams(f.cat === "all" ? {} : { category: f.cat })}
          >
            {f.label}
          </button>
        ))}
      </div>
      <section className="games-grid" id="productGrid">
        <AsyncBoundary status={status} error={error} onRetry={() => dispatch(fetchCatalog())}>
          {list.map((p, i) => (
            <ProductCard key={p.title + p.price} product={p} index={i} highlight={false} />
          ))}
        </AsyncBoundary>
      </section>
    </main>
  );
}
