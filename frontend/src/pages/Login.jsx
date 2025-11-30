import { useState } from "react";
import { apiPost } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user, data.token);
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", minWidth: "400px" }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Travel Accounting</h2>
        <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>Login</h3>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "1rem" }}>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "1rem" }}>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>
          {error && <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#f9fafb", borderRadius: "0.25rem", fontSize: "0.875rem" }}>
          <strong>Default Users:</strong>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
            <li>admin / admin123 (Admin)</li>
            <li>manager / manager123 (Manager)</li>
            <li>accountant / accountant123 (Accountant)</li>
            <li>staff / staff123 (Staff)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



