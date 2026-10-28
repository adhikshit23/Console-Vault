import { useLayoutEffect } from "react";

export default function useStyles(cssText) {
  useLayoutEffect(() => {
    const el = document.createElement("style");
    el.textContent = cssText;
    document.head.appendChild(el);
    return () => el.remove();
  }, [cssText]);
}
