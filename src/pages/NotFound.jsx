import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NotFound() {
  return (
    <PageShell title="Page not found">
      <p>We couldn't find that page.</p>
      <p style={{ marginTop: 16 }}><Link to="/"><button className="cv-btn-primary">Back to home</button></Link></p>
    </PageShell>
  );
}
