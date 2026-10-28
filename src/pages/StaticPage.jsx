import { useMemo } from "react";
import Html from "../components/Html";

const pages = import.meta.glob("../content/*.html", { query: "?raw", import: "default", eager: true });

export default function StaticPage({ name }) {
  const html = useMemo(() => pages[`../content/${name}.html`], [name]);
  return <Html as="main" className="page-main" html={html} />;
}
