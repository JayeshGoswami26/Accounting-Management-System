import { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function RemindersPage() {
  const [overdueBookings, setOverdueBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ total: 0, totalOutstanding: 0 });

  const loadOverdue = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/reports/overdue");
      setOverdueBookings(data);
      const total = data.length;
      const totalOutstanding = data.reduce((sum, b) => sum + (b.remainingBalance || 0), 0);
      setSummary({ total, totalOutstanding });
    } catch (e) {
      setError("Failed to load overdue bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverdue();
  }, []);

  const getDaysOverdue = (travelDate) => {
    if (!travelDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const travel = new Date(travelDate);
    travel.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - travel) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reminders - Overdue Receivables</h1>
        <button onClick={loadOverdue} disabled={loading}>
          Refresh
        </button>
      </div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Total Overdue Bookings</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>{summary.total}</div>
          </div>
          <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Total Outstanding Amount</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>{summary.totalOutstanding}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h2>Overdue bookings (Travel date passed with remaining balance)</h2>
        {error && <p className="error">{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Type</th>
              <th>From/Check-in</th>
              <th>To/Check-out</th>
              <th>Travel Date</th>
              <th>Days Overdue</th>
              <th>Sold At</th>
              <th>Received</th>
              <th>Remaining Balance</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {overdueBookings.map((b) => {
              const daysOverdue = getDaysOverdue(b.travelDate);
              return (
                <tr key={b._id} style={daysOverdue > 30 ? { background: "#fef2f2" } : {}}>
                  <td>{b.customerId?.name || ""}</td>
                  <td>{b.type}</td>
                  <td>
                    {b.type === "hotel"
                      ? b.checkInDate
                        ? new Date(b.checkInDate).toLocaleDateString()
                        : ""
                      : b.from}
                  </td>
                  <td>
                    {b.type === "hotel"
                      ? b.checkOutDate
                        ? new Date(b.checkOutDate).toLocaleDateString()
                        : ""
                      : b.to}
                  </td>
                  <td>{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : ""}</td>
                  <td>
                    <span style={{ color: daysOverdue > 30 ? "#dc2626" : "#f59e0b", fontWeight: "bold" }}>
                      {daysOverdue} days
                    </span>
                  </td>
                  <td>{b.soldAt}</td>
                  <td>{b.totalReceived || 0}</td>
                  <td style={{ fontWeight: "bold", color: "#dc2626" }}>{b.remainingBalance}</td>
                  <td>{b.paymentStatus}</td>
                </tr>
              );
            })}
            {overdueBookings.length === 0 && !loading && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "2rem" }}>
                  No overdue bookings. All customers are up to date!
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "2rem" }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



