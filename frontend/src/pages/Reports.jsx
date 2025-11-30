import { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("profit");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [profitLoss, setProfitLoss] = useState(null);
  const [outstanding, setOutstanding] = useState([]);
  const [lossBookings, setLossBookings] = useState([]);
  const [channelTotals, setChannelTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfitLoss = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "";
      if (dateRange.from || dateRange.to) {
        const params = [];
        if (dateRange.from) params.push(`from=${dateRange.from}`);
        if (dateRange.to) params.push(`to=${dateRange.to}`);
        query = "?" + params.join("&");
      }
      const data = await apiGet(`/api/reports/profit-loss${query}`);
      setProfitLoss(data);
    } catch (e) {
      setError("Failed to load profit & loss report");
    } finally {
      setLoading(false);
    }
  };

  const loadOutstanding = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/reports/outstanding-by-customer");
      setOutstanding(data);
    } catch (e) {
      setError("Failed to load outstanding balances");
    } finally {
      setLoading(false);
    }
  };

  const loadLossBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/reports/loss-bookings");
      setLossBookings(data);
    } catch (e) {
      setError("Failed to load loss bookings");
    } finally {
      setLoading(false);
    }
  };

  const loadChannelTotals = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "";
      if (dateRange.from || dateRange.to) {
        const params = [];
        if (dateRange.from) params.push(`from=${dateRange.from}`);
        if (dateRange.to) params.push(`to=${dateRange.to}`);
        query = "?" + params.join("&");
      }
      const data = await apiGet(`/api/reports/channel-totals${query}`);
      setChannelTotals(data);
    } catch (e) {
      setError("Failed to load channel totals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "profit") {
      loadProfitLoss();
    } else if (activeTab === "outstanding") {
      loadOutstanding();
    } else if (activeTab === "loss") {
      loadLossBookings();
    } else if (activeTab === "channel") {
      loadChannelTotals();
    }
  }, [activeTab, dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const exportToCSV = (data, filename, headers, rowMapper) => {
    const csvHeaders = headers.join(",");
    const csvRows = data.map(rowMapper).map((row) => row.map((cell) => `"${cell}"`).join(","));
    const csv = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportProfitLoss = () => {
    if (!profitLoss || !profitLoss.customerSummary) return;
    exportToCSV(
      profitLoss.customerSummary,
      `profit-loss-${dateRange.from || "all"}-${dateRange.to || "all"}.csv`,
      ["Customer", "Total Bookings", "Total Sold", "Total Cost", "Total Profit/Loss", "Outstanding"],
      (customer) => [
        customer.customerName || "",
        customer.bookingCount || 0,
        customer.totalSold || 0,
        customer.totalCost || 0,
        customer.totalProfit || 0,
        customer.outstanding || 0,
      ]
    );
  };

  const handleExportOutstanding = () => {
    exportToCSV(
      outstanding,
      "outstanding-balances.csv",
      ["Customer Name", "Outstanding Balance", "Number of Bookings"],
      (row) => [row.customerName || "", row.outstanding || 0, row.bookingCount || 0]
    );
  };

  const handleExportLossBookings = () => {
    exportToCSV(
      lossBookings,
      "loss-bookings.csv",
      ["Customer", "Total Loss", "Number of Loss Bookings"],
      (customer) => [
        customer.customerName || "",
        customer.totalLoss || 0,
        customer.bookingCount || 0,
      ]
    );
  };

  const handleExportChannelTotals = () => {
    exportToCSV(
      channelTotals,
      `channel-totals-${dateRange.from || "all"}-${dateRange.to || "all"}.csv`,
      ["Payment Method", "Total Amount", "Number of Payments"],
      (row) => [row.method || "", row.total || 0, row.count || 0]
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Date range filter</h2>
        <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <label>
            From date
            <input type="date" name="from" value={dateRange.from} onChange={handleDateChange} />
          </label>
          <label>
            To date
            <input type="date" name="to" value={dateRange.to} onChange={handleDateChange} />
          </label>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => setDateRange({ from: "", to: "" })}
              style={{ width: "100%" }}
            >
              Clear dates
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
        <button
          onClick={() => setActiveTab("profit")}
          style={{
            background: activeTab === "profit" ? "#2563eb" : "transparent",
            color: activeTab === "profit" ? "white" : "#111827",
            border: "none",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            borderBottom: activeTab === "profit" ? "2px solid #2563eb" : "2px solid transparent",
          }}
        >
          Profit & Loss
        </button>
        <button
          onClick={() => setActiveTab("outstanding")}
          style={{
            background: activeTab === "outstanding" ? "#2563eb" : "transparent",
            color: activeTab === "outstanding" ? "white" : "#111827",
            border: "none",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            borderBottom: activeTab === "outstanding" ? "2px solid #2563eb" : "2px solid transparent",
          }}
        >
          Outstanding Balances
        </button>
        <button
          onClick={() => setActiveTab("loss")}
          style={{
            background: activeTab === "loss" ? "#2563eb" : "transparent",
            color: activeTab === "loss" ? "white" : "#111827",
            border: "none",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            borderBottom: activeTab === "loss" ? "2px solid #2563eb" : "2px solid transparent",
          }}
        >
          Loss Bookings
        </button>
        <button
          onClick={() => setActiveTab("channel")}
          style={{
            background: activeTab === "channel" ? "#2563eb" : "transparent",
            color: activeTab === "channel" ? "white" : "#111827",
            border: "none",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            borderBottom: activeTab === "channel" ? "2px solid #2563eb" : "2px solid transparent",
          }}
        >
          Channel Totals
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {activeTab === "profit" && (
        <div className="card">
          <div className="card-header">
            <h2>Profit & Loss Report</h2>
            <button onClick={handleExportProfitLoss} disabled={!profitLoss}>
              Export to CSV
            </button>
          </div>
          {profitLoss && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Total Bookings</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{profitLoss.count}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Total Sold</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{profitLoss.totalSold}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Total Cost</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{profitLoss.totalCost}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Total Profit</div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: profitLoss.totalProfit >= 0 ? "#059669" : "#dc2626",
                    }}
                  >
                    {profitLoss.totalProfit}
                  </div>
                </div>
              </div>
            </div>
          )}
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total Bookings</th>
                <th>Total Sold</th>
                <th>Total Cost</th>
                <th>Total Profit/Loss</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {profitLoss?.customerSummary?.map((customer) => (
                <tr key={customer.customerId?._id || customer.customerId}>
                  <td>{customer.customerName}</td>
                  <td>{customer.bookingCount}</td>
                  <td>₹{customer.totalSold.toFixed(2)}</td>
                  <td>₹{customer.totalCost.toFixed(2)}</td>
                  <td style={{ color: customer.totalProfit >= 0 ? "#059669" : "#dc2626", fontWeight: "bold" }}>
                    ₹{customer.totalProfit.toFixed(2)}
                  </td>
                  <td>₹{customer.outstanding.toFixed(2)}</td>
                </tr>
              ))}
              {(!profitLoss || !profitLoss.customerSummary || profitLoss.customerSummary.length === 0) && !loading && (
                <tr>
                  <td colSpan={6}>No data available</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6}>Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "outstanding" && (
        <div className="card">
          <div className="card-header">
            <h2>Outstanding Balances by Customer</h2>
            <button onClick={handleExportOutstanding} disabled={outstanding.length === 0}>
              Export to CSV
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Outstanding Balance</th>
                <th>Number of Bookings</th>
              </tr>
            </thead>
            <tbody>
              {outstanding.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.customerName}</td>
                  <td style={{ fontWeight: "bold", color: "#dc2626" }}>{row.outstanding}</td>
                  <td>{row.bookingCount}</td>
                </tr>
              ))}
              {outstanding.length === 0 && !loading && (
                <tr>
                  <td colSpan={3}>No outstanding balances</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={3}>Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "loss" && (
        <div className="card">
          <div className="card-header">
            <h2>Loss Bookings (Negative Profit)</h2>
            <button onClick={handleExportLossBookings} disabled={lossBookings.length === 0}>
              Export to CSV
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total Loss</th>
                <th>Number of Loss Bookings</th>
              </tr>
            </thead>
            <tbody>
              {lossBookings.map((customer, idx) => (
                <tr key={customer.customerId?._id || customer.customerId || idx}>
                  <td>{customer.customerName}</td>
                  <td style={{ color: "#dc2626", fontWeight: "bold" }}>₹{customer.totalLoss.toFixed(2)}</td>
                  <td>{customer.bookingCount}</td>
                </tr>
              ))}
              {lossBookings.length === 0 && !loading && (
                <tr>
                  <td colSpan={3}>No loss bookings</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={3}>Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "channel" && (
        <div className="card">
          <div className="card-header">
            <h2>Payment Channel Totals</h2>
            <button onClick={handleExportChannelTotals} disabled={channelTotals.length === 0}>
              Export to CSV
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Total Amount</th>
                <th>Number of Payments</th>
                <th>Average Amount</th>
              </tr>
            </thead>
            <tbody>
              {channelTotals.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textTransform: "capitalize" }}>{row.method}</td>
                  <td style={{ fontWeight: "bold" }}>{row.total}</td>
                  <td>{row.count}</td>
                  <td>{row.count > 0 ? (row.total / row.count).toFixed(2) : 0}</td>
                </tr>
              ))}
              {channelTotals.length === 0 && !loading && (
                <tr>
                  <td colSpan={4}>No payment data available</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={4}>Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


