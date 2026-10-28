import { useEffect, useRef } from "react";
import Html from "../components/Html";
import { useUI } from "../context/UIContext";
import homeHtml from "../content/home.html?raw";

export default function Home() {
  const rootRef = useRef(null);
  const { showMessage } = useUI();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const cleanups = [];

    const imageScroll = root.querySelector(".image-scroll");
    if (imageScroll) {
      let userScrolling = false;
      let t;
      const onScroll = () => {
        userScrolling = true;
        clearTimeout(t);
        t = setTimeout(() => (userScrolling = false), 1500);
      };
      imageScroll.addEventListener("scroll", onScroll);
      const iv = setInterval(() => {
        if (userScrolling) return;
        imageScroll.scrollBy({ left: 400, behavior: "smooth" });
        if (imageScroll.scrollLeft + imageScroll.clientWidth >= imageScroll.scrollWidth) {
          imageScroll.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 3000);
      cleanups.push(() => { clearInterval(iv); clearTimeout(t); imageScroll.removeEventListener("scroll", onScroll); });
    }

    [["consolesScroll", "consolesPrev", "consolesNext"], ["pcHwScroll", "pcHwPrev", "pcHwNext"]].forEach(([s, p, n]) => {
      const scroller = root.querySelector("#" + s);
      const prev = root.querySelector("#" + p);
      const next = root.querySelector("#" + n);
      if (!scroller || !prev || !next) return;
      const amount = () => Math.min(scroller.clientWidth * 0.8, 480);
      const back = () => scroller.scrollBy({ left: -amount(), behavior: "smooth" });
      const fwd = () => scroller.scrollBy({ left: amount(), behavior: "smooth" });
      prev.addEventListener("click", back);
      next.addEventListener("click", fwd);
      cleanups.push(() => { prev.removeEventListener("click", back); next.removeEventListener("click", fwd); });
    });

    const title = root.querySelector(".games-section h2");
    const grid = root.querySelector(".games-grid");
    if (title && grid) {
      let asc = true;
      const onDbl = () => {
        const cards = Array.from(grid.querySelectorAll(".game-card"));
        cards.forEach((c) => c.classList.add("card-sorting"));
        setTimeout(() => {
          const price = (c) => parseInt(c.querySelector(".price").textContent.replace(/[₹,]/g, ""), 10);
          cards.sort((a, b) => (asc ? price(a) - price(b) : price(b) - price(a)));
          cards.forEach((c, i) => { c.style.transitionDelay = `${i * 60}ms`; grid.appendChild(c); c.classList.remove("card-sorting"); });
          showMessage(asc ? "Sorted: Low to High" : "Sorted: High to Low", "success");
          asc = !asc;
          setTimeout(() => cards.forEach((c) => (c.style.transitionDelay = "")), cards.length * 60 + 550);
        }, 300);
      };
      title.addEventListener("dblclick", onDbl);
      cleanups.push(() => title.removeEventListener("dblclick", onDbl));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [showMessage]);

  return (
    <div ref={rootRef} style={{ display: "contents" }}>
      <Html html={homeHtml} as="div" style={{ display: "contents" }} />
    </div>
  );
}
