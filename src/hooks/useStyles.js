import { useLayoutEffect } from "react";

// mainpage.css and login.css both style html/body/#bgPhoto, so they can't both be loaded at once.
// Each layout injects its own stylesheet while mounted and removes it on unmount, which keeps the
// original CSS files completely unchanged.
export default function useStyles(cssText) {
  useLayoutEffect(() => {
    const el = document.createElement("style");
    el.textContent = cssText;
    document.head.appendChild(el);
    return () => el.remove();
  }, [cssText]);
}
