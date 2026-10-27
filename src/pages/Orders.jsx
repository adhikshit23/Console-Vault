import { useSelector } from "react-redux";
import PageShell from "../components/PageShell";
import { rupees } from "../utils/product";

export default function Orders() {
  const orders = useSelector((s) => s.orders.list);
  return (
    <PageShell title="My Orders">
      <div id="ordersList" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ background: "rgba(0,0,0,0.2)", padding: 20, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10, marginBottom: 10 }}>
                <div>
                  <strong>Order {order.id}</strong>
                  <span style={{ opacity: 0.6, fontSize: 14, marginLeft: 10 }}>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div style={{ color: "#34d399" }}>{order.status}</div>
              </div>
              <div>{order.items.map((item) => <div key={item.id}>{item.qty || 1}x {item.name}</div>)}</div>
              <div style={{ marginTop: 15, fontWeight: "bold", color: "#58b8d7" }}>Total: {rupees(order.total)}</div>
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}
