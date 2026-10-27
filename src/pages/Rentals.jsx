import { useEffect, useRef } from "react";
import Html from "../components/Html";
import { useUI } from "../context/UIContext";
import rentalsHtml from "../content/rentals.html?raw";
import rentalsScript from "../content/rentals-script.txt?raw";

// The rentals marketplace (list a console / book a console) is a large self-contained widget.
// It is mounted as an "island": its original markup + logic run unchanged inside this route,
// wired to the shared toast. Converting it to React components is a good follow-up.
const body = rentalsScript
  .replace(/^\s*document\.addEventListener\("DOMContentLoaded",\s*\(\)\s*=>\s*\{/, "")
  .replace(/\}\);\s*$/, "")
  .replace(/window\.showMessage/g, "showMessage")
  .replace('window.location.hash === "#list"', 'window.location.hash.includes("tab=list")');

export default function Rentals() {
  const { showMessage } = useUI();
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // eslint-disable-next-line no-new-func
    new Function("showMessage", body)(showMessage);
  }, [showMessage]);
  return <Html as="main" className="page-main" html={rentalsHtml} />;
}
