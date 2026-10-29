
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";

const methodNames = {
  upi: "UPI",
  card: "Credit / Debit Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
};

export default function OrderConfirmation() {
  const [params] = useSearchParams();

  const id = params.get("id");
  const payment = params.get("payment") || "Demo Successful";
  const method = params.get("method") || "upi";

  const isCOD = payment === "Pay on Delivery";

  return (
    <PageShell title={isCOD ? "Order Placed" : "Payment Confirmation"}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div
          style={{
            fontSize: 64,
            color: "#34d399",
            marginBottom: 16,
          }}
        >
          ✓
        </div>

        <h2>
          {isCOD
            ? "Your order has been placed!"
            : "Payment Successful!"}
        </h2>

        <p style={{ opacity: 0.8 }}>
          Thank you for shopping with ConsoleVault.
        </p>

        <div
          style={{
            maxWidth: 460,
            margin: "28px auto",
            padding: 22,
            textAlign: "left",
            borderRadius: 14,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(88,184,215,0.35)",
          }}
        >
          <p>
            <strong>Order ID:</strong>{" "}
            <span style={{ color: "#58b8d7" }}>{id}</span>
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {methodNames[method] || method}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            <span style={{ color: "#34d399" }}>{payment}</span>
          </p>

          <p style={{ fontSize: 12, opacity: 0.65, marginBottom: 0 }}>
            College project demonstration only. This page does not confirm a
            real financial transaction.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Link to="/orders">
            <button className="cv-btn-primary">View My Orders</button>
          </Link>

          <Link to="/">
            <button
              className="cv-btn-primary"
              style={{
                background: "transparent",
                border: "1px solid #3b82f6",
              }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
