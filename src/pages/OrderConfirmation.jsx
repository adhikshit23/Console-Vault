import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const id = params.get("id");
  return (
    <PageShell title="Order Confirmed">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, color: "#34d399", marginBottom: 20 }}>✓</div>
        <h3>Thank you for your order!</h3>
        <p>Your order <strong id="confOrderId" style={{ color: "#58b8d7" }}>{id}</strong> has been placed successfully.</p>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 15 }}>
          <Link to="/orders"><button className="cv-btn-primary">View My Orders</button></Link>
          <Link to="/"><button className="cv-btn-primary" style={{ background: "transparent", border: "1px solid #3b82f6" }}>Continue Shopping</button></Link>
        </div>
      </div>
    </PageShell>
  );
}
