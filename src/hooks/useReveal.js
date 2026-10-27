import { useEffect } from "react";

// Same staggered scroll-reveal as site.js / mainpage.js, re-run whenever the route/content changes.
export default function useReveal(deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (!els.length) return undefined;
    const groups = new Map();
    els.forEach((el) => {
      if (!groups.has(el.parentElement)) groups.set(el.parentElement, []);
      groups.get(el.parentElement).push(el);
    });
    groups.forEach((sib) => {
      if (sib.length > 1) sib.forEach((el, i) => (el.style.transitionDelay = `${i * 90}ms`));
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-visible");
          el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
