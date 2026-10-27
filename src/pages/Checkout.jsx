import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../components/PageShell";
import FormField from "../components/FormField";
import { useForm } from "../hooks/useForm";
import { email, minLength, required } from "../utils/validators";
import { clearCart, selectCartItems, selectCartTotal } from "../store/cartSlice";
import { orderPlaced } from "../store/ordersSlice";
import { useAuth } from "../context/AuthContext";
import { rupees } from "../utils/product";

const rules = {
  name: [required("Full name")],
  email: [required("Email"), email()],
  address: [required("Address"), minLength(10, "Address")],
};

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initial = useMemo(() => ({ name: user?.name || "", email: user?.email || "", address: "" }), [user]);
  const form = useForm(initial, rules);

  // empty cart -> back to the store (same as the old checkout.html)
  if (items.length === 0) return <Navigate to="/" replace />;

  const submit = form.handleSubmit(() => {
    const order = {
      id: "ORD-" + Math.floor(Math.random() * 1000000),
      date: new Date().toISOString(),
      items,
      total,
      status: "Processing",
    };
    dispatch(orderPlaced(order));
    dispatch(clearCart());
    navigate(`/order-confirmation?id=${order.id}`);
  });

  return (
    <PageShell title="Checkout">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <h3>Billing Information</h3>
          <form className="cv-form" id="checkoutForm" onSubmit={submit} noValidate>
            <FormField label="Full Name" name="name" id="chkName" value={form.values.name} error={form.errors.name} onChange={form.handleChange} onBlur={form.handleBlur} />
            <FormField label="Email" name="email" id="chkEmail" type="email" value={form.values.email} error={form.errors.email} onChange={form.handleChange} onBlur={form.handleBlur} />
            <FormField label="Address" name="address" as="textarea" rows={3} value={form.values.address} error={form.errors.address} onChange={form.handleChange} onBlur={form.handleBlur} />
            <button type="submit" className="cv-btn-primary" style={{ marginTop: 20, width: "100%" }}>Place Order</button>
          </form>
        </div>
        <div>
          <h3>Order Summary</h3>
          <div id="checkoutSummary" style={{ background: "rgba(0,0,0,0.2)", padding: 20, borderRadius: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }}>
                  <div>{item.name} x{item.qty || 1}</div>
                  <div>{rupees((item.qty || 1) * item.price)}</div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 18, marginTop: 10, color: "#58b8d7" }}>
                <div>Total</div>
                <div>{rupees(total)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
