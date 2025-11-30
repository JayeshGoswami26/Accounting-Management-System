import { useState } from "react";
import { apiPost } from "../api";

export default function ImportPage() {
  const [importType, setImportType] = useState("bookings");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!file) {
      setError("Please select a file");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const endpoint = importType === "tally" ? "/api/import/tally" : "/api/import/bookings";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Import failed");
      }
      const data = await response.json();
      setResult(data);
      setFile(null);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to import data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bulk Import</h1>
      </div>
      <div className="page-grid">
        <div className="card">
          <h2>Import Data</h2>
          <form onSubmit={handleImport} className="form-grid">
            <label>
              Import Type
              <select value={importType} onChange={(e) => setImportType(e.target.value)}>
                <option value="bookings">Bookings (Excel/XLSX)</option>
                <option value="tally">Tally Export (Excel/XLSX)</option>
              </select>
            </label>
            <label>
              File (Excel/XLSX)
              <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} required />
            </label>
            <div>
              <button type="submit" disabled={loading || !file}>
                {loading ? "Importing..." : "Import"}
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
        <div className="card">
          <h2>Import Instructions</h2>
          <div style={{ lineHeight: "1.8" }}>
            <h3>For Bookings Import:</h3>
            <p>Your Excel file should have the following columns:</p>
            <ul>
              <li><strong>Customer Name</strong> (required)</li>
              <li><strong>Phone</strong> (optional)</li>
              <li><strong>Email</strong> (optional)</li>
              <li><strong>Company Name</strong> (optional)</li>
              <li><strong>Address</strong> (optional)</li>
              <li><strong>State Code</strong> (optional)</li>
              <li><strong>GSTIN</strong> (optional)</li>
              <li><strong>Type</strong> (flight/hotel/package/other)</li>
              <li><strong>From</strong> (optional)</li>
              <li><strong>To</strong> (optional)</li>
              <li><strong>Travel Date</strong> (required)</li>
              <li><strong>Booking Date</strong> (optional)</li>
              <li><strong>Sold At</strong> (required)</li>
              <li><strong>Supplier Cost</strong> (required)</li>
              <li><strong>Received</strong> (optional)</li>
              <li><strong>Payment Method</strong> (optional)</li>
            </ul>
            <h3>For Tally Import:</h3>
            <p>Export your Tally data to Excel format. The system will automatically detect:</p>
            <ul>
              <li>Party Name (Customer)</li>
              <li>Voucher Type (Payment/Receipt)</li>
              <li>Amount</li>
              <li>Date</li>
            </ul>
            <p style={{ marginTop: "1rem", padding: "1rem", background: "#fef3c7", borderRadius: "0.5rem" }}>
              <strong>Note:</strong> The system will create customers if they don't exist. Existing customers with the same name/phone/email will be matched.
            </p>
          </div>
        </div>
      </div>
      {result && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h2>Import Results</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Customers Created</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{result.customersCreated || 0}</div>
            </div>
            <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Bookings Created</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{result.bookingsCreated || 0}</div>
            </div>
            {result.paymentsCreated !== undefined && (
              <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Payments Created</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{result.paymentsCreated || 0}</div>
              </div>
            )}
          </div>
          {result.errors && result.errors.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3 style={{ color: "#dc2626" }}>Errors ({result.errors.length}):</h3>
              <ul style={{ maxHeight: "200px", overflowY: "auto", background: "#fef2f2", padding: "1rem", borderRadius: "0.5rem" }}>
                {result.errors.map((err, idx) => (
                  <li key={idx} style={{ marginBottom: "0.5rem" }}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

