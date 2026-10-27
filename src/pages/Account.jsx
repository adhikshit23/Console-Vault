import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export default function Account() {
  const { user, logout } = useAuth();
  const { showMessage } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!user) return;
    logout();
    showMessage("Logged out successfully", "success");
    navigate("/login", { replace: true });
  };

  return (
    <PageShell title="Your Account">
      <div id="accountProfile">
        <h3 id="profileName">Welcome, {user?.name || "Gamer"}</h3>
        <p id="profileEmail" style={{ color: "#94a3b8", marginTop: 4 }}>{user?.email}</p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="cv-btn-primary" onClick={() => navigate("/orders")}>My Orders</button>
          <button className="cv-btn-secondary" onClick={() => navigate("/settings")}>Settings</button>
          <button className="cv-btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </PageShell>
  );
}
