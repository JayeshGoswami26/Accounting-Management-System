import { useState, useEffect } from "react";
import "./App.css";
import { apiGet } from "./api";
import CustomersPage from "./pages/Customers";
import DailyEntriesPage from "./pages/DailyEntries";
import PaymentsPage from "./pages/Payments";
import RefundsPage from "./pages/Refunds";
import InvoicesPage from "./pages/Invoices";
import RemindersPage from "./pages/Reminders";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import UsersPage from "./pages/Users";
import LoginPage from "./pages/Login";
import StatementsPage from "./pages/Statements";
import ImportPage from "./pages/Import";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [view, setView] = useState("dashboard");
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setView("dashboard");
  };

  // Check if user can view internal data
  const canViewInternal = () => {
    return user && ["admin", "manager", "accountant"].includes(user.role);
  };

  // Check if user can edit settings
  const canEditSettings = () => {
    return user && ["admin", "manager"].includes(user.role);
  };

  // Check if user can manage users
  const canManageUsers = () => {
    return user && ["admin", "manager"].includes(user.role);
  };

  const loadHealth = async () => {
    const data = await apiGet("/health");
    setHealth(data.status);
  };

  if (!user || !token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2>Travel Accounting</h2>
          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            {user.name} ({user.role})
          </div>
        </div>
        <nav>
          <button onClick={() => setView("dashboard")}>Dashboard</button>
          <button onClick={() => setView("daily")}>Daily entries</button>
          <button onClick={() => setView("customers")}>Customers</button>
          <button onClick={() => setView("invoices")}>Invoices</button>
          <button onClick={() => setView("payments")}>Payments</button>
          <button onClick={() => setView("refunds")}>Refunds</button>
          <button onClick={() => setView("reports")}>Reports</button>
          <button onClick={() => setView("statements")}>Statements</button>
          <button onClick={() => setView("import")}>Bulk Import</button>
          <button onClick={() => setView("reminders")}>Reminders</button>
          {canEditSettings() && <button onClick={() => setView("settings")}>Settings</button>}
          {canManageUsers() && <button onClick={() => setView("users")}>Users</button>}
          <button onClick={handleLogout} style={{ marginTop: "auto", background: "#dc2626" }}>
            Logout
          </button>
        </nav>
      </aside>
      <main className="main">
        {view === "dashboard" && (
          <div className="page">
            <div className="page-header">
              <h1>Dashboard</h1>
            </div>
            <button onClick={loadHealth}>Check API health</button>
            {health && <p>API status: {health}</p>}
          </div>
        )}
        {view === "daily" && <DailyEntriesPage />}
        {view === "customers" && <CustomersPage />}
        {view === "invoices" && <InvoicesPage />}
        {view === "payments" && <PaymentsPage />}
        {view === "refunds" && <RefundsPage />}
        {view === "reports" && <ReportsPage />}
        {view === "statements" && <StatementsPage />}
        {view === "import" && <ImportPage />}
        {view === "reminders" && <RemindersPage />}
        {view === "settings" && <SettingsPage />}
        {view === "users" && <UsersPage />}
      </main>
    </div>
  );
}

export default App;
