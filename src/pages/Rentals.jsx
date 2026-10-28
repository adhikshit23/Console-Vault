import { useEffect, useRef } from "react";
import Html from "../components/Html";
import { useUI } from "../context/UIContext";
import rentalsHtml from "../content/rentals.html?raw";
import rentalsScript from "../content/rentals-script.txt?raw";

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
    new Function("showMessage", body)(showMessage);
  }, [showMessage]);
  return <Html as="main" className="page-main" html={rentalsHtml} />;
}
