import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

export default function StatementsPage() {
  const [statements, setStatements] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [reconciliationResult, setReconciliationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadForm, setUploadForm] = useState({
    type: "bank",
    accountName: "",
    statementDate: "",
    file: null,
  });

  const loadStatements = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/statements");
      setStatements(data);
    } catch (e) {
      setError("Failed to load statements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatements();
  }, []);

  const handleFileChange = (e) => {
    setUploadForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    if (!uploadForm.file) {
      setError("Please select a file");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("type", uploadForm.type);
      formData.append("accountName", uploadForm.accountName);
      formData.append("statementDate", uploadForm.statementDate);
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/statements/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }
      const data = await response.json();
      setUploadForm({
        type: "bank",
        accountName: "",
        statementDate: "",
        file: null,
      });
      await loadStatements();
      setError("");
    } catch (e) {
      setError(e.message || "Failed to upload statement");
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = async (statementId) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiPost(`/api/statements/${statementId}/reconcile`, {});
      setReconciliationResult(data);
      setSelectedStatement(data.statement);
      await loadStatements();
    } catch (e) {
      setError("Failed to reconcile statement");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStatement = async (statementId) => {
    try {
      const data = await apiGet(`/api/statements/${statementId}`);
      setSelectedStatement(data);
      setReconciliationResult(null);
    } catch (e) {
      setError("Failed to load statement");
    }
  };

  const handleDelete = async (statementId) => {
    if (!confirm("Delete this statement?")) return;
    setError("");
    try {
      await apiDelete(`/api/statements/${statementId}`);
      await loadStatements();
      if (selectedStatement?._id === statementId) {
        setSelectedStatement(null);
        setReconciliationResult(null);
      }
    } catch (e) {
      setError("Failed to delete statement");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bank & Credit Card Statements</h1>
        <button onClick={loadStatements} disabled={loading}>
          Refresh
        </button>
      </div>
      {error && <p className="error" style={{ margin: "1rem" }}>{error}</p>}
      <div className="page-grid">
        <div className="card">
          <h2>Upload Statement</h2>
          <form onSubmit={handleUpload} className="form-grid">
            <label>
              Statement Type
              <select
                name="type"
                value={uploadForm.type}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="bank">Bank Statement</option>
                <option value="credit_card">Credit Card Statement</option>
              </select>
            </label>
            <label>
              Account Name
              <input
                name="accountName"
                value={uploadForm.accountName}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, accountName: e.target.value }))}
                placeholder="e.g., HDFC Bank - Savings"
                required
              />
            </label>
            <label>
              Statement Date
              <input
                type="date"
                name="statementDate"
                value={uploadForm.statementDate}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, statementDate: e.target.value }))}
                required
              />
            </label>
            <label>
              Statement File (Excel/CSV)
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} required />
            </label>
            <div>
              <button type="submit" disabled={loading}>
                Upload
              </button>
            </div>
          </form>
        </div>
        <div className="card">
          <h2>Uploaded Statements</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Account</th>
                <th>Statement Date</th>
                <th>Transactions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((s) => (
                <tr key={s._id}>
                  <td>{s.type === "bank" ? "Bank" : "Credit Card"}</td>
                  <td>{s.accountName}</td>
                  <td>{s.statementDate ? new Date(s.statementDate).toLocaleDateString() : ""}</td>
                  <td>{s.transactions?.length || 0}</td>
                  <td>
                    {s.reconciled ? (
                      <span style={{ color: "#059669" }}>Reconciled</span>
                    ) : (
                      <span style={{ color: "#f59e0b" }}>Pending</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleViewStatement(s._id)} style={{ marginRight: "0.5rem" }}>
                      View
                    </button>
                    {!s.reconciled && (
                      <button onClick={() => handleReconcile(s._id)} style={{ marginRight: "0.5rem" }}>
                        Reconcile
                      </button>
                    )}
                    <button onClick={() => handleDelete(s._id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {statements.length === 0 && !loading && (
                <tr>
                  <td colSpan={6}>No statements uploaded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedStatement && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <h2>
              Statement Details - {selectedStatement.type === "bank" ? "Bank" : "Credit Card"} - {selectedStatement.accountName}
            </h2>
            <button onClick={() => setSelectedStatement(null)}>Close</button>
          </div>
          {reconciliationResult && (
            <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "0.5rem", marginBottom: "1rem" }}>
              <h3>Reconciliation Results</h3>
              <p>
                <strong>Matched:</strong> {reconciliationResult.matchedCount} transactions
              </p>
              <p>
                <strong>Unmatched:</strong> {reconciliationResult.unmatchedCount} transactions
              </p>
            </div>
          )}
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedStatement.transactions?.map((t, idx) => (
                <tr key={idx} style={t.matched ? { background: "#d1fae5" } : {}}>
                  <td>{t.date ? new Date(t.date).toLocaleDateString() : ""}</td>
                  <td>{t.description}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.balance ? `₹${t.balance}` : "-"}</td>
                  <td>{t.reference || "-"}</td>
                  <td>
                    {t.matched ? (
                      <span style={{ color: "#059669" }}>✓ Matched</span>
                    ) : (
                      <span style={{ color: "#dc2626" }}>✗ Unmatched</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

