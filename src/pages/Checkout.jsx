import AddressMap from "../components/AddressMap";
import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../components/PageShell";
import FormField from "../components/FormField";
import { useForm } from "../hooks/useForm";
import { email, minLength, required } from "../utils/validators";
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
} from "../store/cartSlice";
import { orderPlaced } from "../store/ordersSlice";
import { useAuth } from "../context/AuthContext";
import { rupees } from "../utils/product";

const rules = {
  name: [required("Full name")],
  email: [required("Email"), email()],
  address: [required("Address"), minLength(10, "Address")],
};

const paymentMethods = [
  { id: "upi", label: "UPI", detail: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", detail: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", detail: "Demo online payment" },
  { id: "cod", label: "Cash on Delivery", detail: "Pay when your order arrives" },
];

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const initial = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      address: "",
    }),
    [user]
  );

  const form = useForm(initial, rules);

  
const handleAddressSelect = useCallback(
  (address) => {
    form.setValues((previous) => ({
      ...previous,
      address,
    }));
  },
  [form.setValues]
);

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  const placeOrder = (paymentStatus) => {
    const orderId = "CV-" + Date.now().toString().slice(-8);

    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items,
      total,
      status: "Processing",
      paymentMethod,
      paymentStatus,
      customer: {
        name: form.values.name,
        email: form.values.email,
        address: form.values.address,
      },
    };

    dispatch(orderPlaced(order));
    dispatch(clearCart());

    navigate(
      `/order-confirmation?id=${orderId}&payment=${encodeURIComponent(
        paymentStatus
      )}&method=${encodeURIComponent(paymentMethod)}`
    );
  };

  const submit = form.handleSubmit(() => {
    setPaymentError("");

    if (paymentMethod === "cod") {
      placeOrder("Pay on Delivery");
    } else {
      setShowPayment(true);
    }
  });

  const paymentLabel =
    paymentMethods.find((method) => method.id === paymentMethod)?.label ||
    "UPI";

  return (
    <PageShell title="Checkout">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Billing information */}
        <div>
          <h3>Billing Information</h3>

          <form
            className="cv-form"
            id="checkoutForm"
            onSubmit={submit}
            noValidate
          >
            <FormField
              label="Full Name"
              name="name"
              id="chkName"
              value={form.values.name}
              error={form.errors.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />

            <FormField
              label="Email"
              name="email"
              id="chkEmail"
              type="email"
              value={form.values.email}
              error={form.errors.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />

            <FormField
              label="Address"
              name="address"
              id="chkAddress"
              as="textarea"
              rows={3}
              value={form.values.address}
              error={form.errors.address}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
<AddressMap onAddressSelect={handleAddressSelect} />
            <h3 style={{ marginTop: 28 }}>Payment Method</h3>

            <div style={{ display: "grid", gap: 12 }}>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 16,
                    border: `1px solid ${
                      paymentMethod === method.id ? "#58b8d7" : "#444"
                    }`,
                    borderRadius: 10,
                    cursor: "pointer",
                    background:
                      paymentMethod === method.id
                        ? "rgba(88,184,215,0.10)"
                        : "rgba(0,0,0,0.15)",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => {
                      setPaymentMethod(method.id);
                      setPaymentError("");
                    }}
                  />

                  <span>
                    <strong style={{ display: "block" }}>
                      {method.id === "upi" && "📱 "}
                      {method.id === "card" && "💳 "}
                      {method.id === "netbanking" && "🏦 "}
                      {method.id === "cod" && "💵 "}
                      {method.label}
                    </strong>

                    <small style={{ opacity: 0.75 }}>
                      {method.detail}
                    </small>
                  </span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="cv-btn-primary"
              style={{ marginTop: 24, width: "100%" }}
            >
              {paymentMethod === "cod"
                ? "Place Order"
                : `Continue to Payment · ${rupees(total)}`}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <h3>Order Summary</h3>

          <div
            id="checkoutSummary"
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <div style={{ display: "grid", gap: 14 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingBottom: 12,
                  }}
                >
                  <span>
                    {item.name} × {item.qty || 1}
                  </span>

                  <strong>
                    {rupees((item.qty || 1) * Number(item.price))}
                  </strong>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: 19,
                  marginTop: 8,
                  color: "#58b8d7",
                }}
              >
                <span>Total</span>
                <span>{rupees(total)}</span>
              </div>

              <p style={{ fontSize: 13, opacity: 0.75 }}>
                Payment method: {paymentLabel}
              </p>
            </div>
          </div>

          <p style={{ fontSize: 13, opacity: 0.7, marginTop: 16 }}>
            🔒 College project demo. No real payment will be processed.
          </p>
        </div>
      </div>

      {/* Demo payment window */}
      {showPayment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demoPaymentTitle"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.82)",
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              padding: 28,
              borderRadius: 18,
              background: "#171b25",
              border: "1px solid #343c4d",
              color: "#fff",
              boxSizing: "border-box",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 36 }}>🔐</div>

              <h2 id="demoPaymentTitle" style={{ marginBottom: 8 }}>
                ConsoleVault Pay
              </h2>

              <p style={{ opacity: 0.75, margin: 0 }}>
                Demo Payment Gateway
              </p>

              <h2 style={{ color: "#58b8d7", marginTop: 20 }}>
                {rupees(total)}
              </h2>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(88,184,215,0.10)",
                marginBottom: 20,
              }}
            >
              <strong>Selected method: {paymentLabel}</strong>

              <p style={{ marginBottom: 0, fontSize: 13, opacity: 0.8 }}>
                This is a simulation for your college presentation. No money
                will be transferred. Do not enter real payment credentials.
              </p>
            </div>

            {paymentError && (
              <p role="alert" style={{ color: "#ff8b8b" }}>
                {paymentError}
              </p>
            )}

            <button
              type="button"
              className="cv-btn-primary"
              style={{ width: "100%", marginBottom: 12 }}
              onClick={() => placeOrder("Demo Successful")}
            >
              ✓ Simulate Successful Payment
            </button>

            <button
              type="button"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                background: "transparent",
                color: "#ff9a9a",
                border: "1px solid #a64b4b",
              }}
              onClick={() =>
                setPaymentError(
                  "Demo payment failed. Your order has not been placed. You can try again."
                )
              }
            >
              ✕ Simulate Failed Payment
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPayment(false);
                setPaymentError("");
              }}
              style={{
                display: "block",
                margin: "18px auto 0",
                background: "transparent",
                color: "#ddd",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel and go back
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
