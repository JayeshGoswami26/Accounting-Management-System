import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    bookingId: "",
    invoiceNumber: "",
    invoiceDate: "",
    baseSellingAmount: "",
    serviceCharge: "",
    amountReceived: "",
    gstCalculationMethod: "service_charge_only",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/invoices");
      setInvoices(data);
    } catch (e) {
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await apiGet("/api/bookings");
      setBookings(data.filter((b) => !b.hotelRefundProcessed && !b.fullRefundIssued));
    } catch (e) {
      setError("Failed to load bookings");
    }
  };

  const loadSettings = async () => {
    try {
      const data = await apiGet("/api/settings");
      setSettings(data);
    } catch (e) {
      console.error("Failed to load settings");
    }
  };

  useEffect(() => {
    loadInvoices();
    loadBookings();
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  const checkExistingInvoice = async (bookingId) => {
    const existing = invoices.find((inv) => {
      const bookingIds = inv.bookingIds || [];
      return bookingIds.some((bid) => {
        const id = bid?._id || bid;
        return id === bookingId || id?.toString() === bookingId?.toString();
      });
    });
    if (existing) {
      return existing;
    }
    return null;
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.bookingId) {
      setError("Select a booking");
      return;
    }
    const booking = bookings.find((b) => b._id === form.bookingId);
    if (!booking) {
      setError("Booking not found");
      return;
    }
    const existingInvoice = await checkExistingInvoice(form.bookingId);
    if (existingInvoice && !editingInvoiceId) {
      setError(`Invoice already exists for this booking. Invoice #${existingInvoice.invoiceNumber}. Please edit the existing invoice.`);
      setSelectedInvoice(existingInvoice);
      return;
    }
    const body = {
      invoiceNumber: form.invoiceNumber || `INV-${Date.now()}`,
      invoiceDate: form.invoiceDate || new Date().toISOString().split("T")[0],
      baseSellingAmount: form.baseSellingAmount ? Number(form.baseSellingAmount) : booking.soldAt,
      serviceCharge: form.serviceCharge ? Number(form.serviceCharge) : 0,
      amountReceived: form.amountReceived ? Number(form.amountReceived) : 0,
      gstCalculationMethod: form.gstCalculationMethod || "service_charge_only",
    };
    try {
      if (editingInvoiceId) {
        await apiPut(`/api/invoices/${editingInvoiceId}`, body);
        setEditingInvoiceId(null);
      } else {
        await apiPost(`/api/invoices/from-booking/${form.bookingId}`, body);
      }
      setForm({
        bookingId: "",
        invoiceNumber: "",
        invoiceDate: "",
        baseSellingAmount: "",
        serviceCharge: "",
        amountReceived: "",
        gstCalculationMethod: "service_charge_only",
      });
      await loadInvoices();
    } catch (e) {
      if (e.errorData?.invoiceId) {
        setError(e.errorData.message);
        setSelectedInvoice(await apiGet(`/api/invoices/${e.errorData.invoiceId}`));
      } else {
        setError(e.message || "Failed to generate invoice");
      }
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoiceId(invoice._id);
    const bookingIds = invoice.bookingIds || [];
    const firstBookingId = bookingIds[0];
    setForm({
      bookingId: firstBookingId?._id || firstBookingId || "",
      invoiceNumber: invoice.invoiceNumber || "",
      invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split("T")[0] : "",
      baseSellingAmount: invoice.baseSellingAmount || "",
      serviceCharge: invoice.serviceCharge || "",
      amountReceived: invoice.amountReceived || "",
      gstCalculationMethod: invoice.gstCalculationMethod || "service_charge_only",
    });
    setSelectedInvoice(null);
  };

  const handleViewInvoice = async (invoiceId) => {
    try {
      const data = await apiGet(`/api/invoices/${invoiceId}`);
      setSelectedInvoice(data);
    } catch (e) {
      setError("Failed to load invoice");
    }
  };

  const handleUpdatePayment = async (invoiceId, amountReceived) => {
    try {
      await apiPut(`/api/invoices/${invoiceId}`, { amountReceived: Number(amountReceived) });
      await loadInvoices();
      if (selectedInvoice?._id === invoiceId) {
        const updated = await apiGet(`/api/invoices/${invoiceId}`);
        setSelectedInvoice(updated);
      }
    } catch (e) {
      setError("Failed to update payment");
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_BASE}/api/invoices/export/csv`, "_blank");
  };

  const getInvoiceNumber = () => {
    const maxNum = invoices.reduce((max, inv) => {
      const match = inv.invoiceNumber?.match(/\d+/);
      if (match) {
        const num = parseInt(match[0]);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    return `INV-${String(maxNum + 1).padStart(4, "0")}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Invoices</h1>
        <button onClick={handleExportCSV}>Export to CSV</button>
      </div>
      <div className="page-grid">
        <div className="card">
          <h2>{editingInvoiceId ? "Edit invoice" : "Generate invoice from booking"}</h2>
          <form onSubmit={handleGenerateInvoice} className="form-grid">
            <label>
              Booking
              <select name="bookingId" value={form.bookingId} onChange={handleChange} required>
                <option value="">Select booking</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.customerId?.companyName || b.customerId?.name || ""} - {b.type} - Sold: {b.soldAt}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Invoice number
              <input
                name="invoiceNumber"
                value={form.invoiceNumber || getInvoiceNumber()}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
              />
            </label>
            <label>
              Invoice date
              <input
                type="date"
                name="invoiceDate"
                value={form.invoiceDate || new Date().toISOString().split("T")[0]}
                onChange={handleChange}
              />
            </label>
            <label>
              Base selling amount
              <input
                type="number"
                name="baseSellingAmount"
                value={form.baseSellingAmount}
                onChange={handleChange}
                placeholder="Uses booking sold amount if empty"
              />
            </label>
            <label>
              Service charge
              <input
                type="number"
                name="serviceCharge"
                value={form.serviceCharge}
                onChange={handleChange}
                placeholder="0"
              />
            </label>
            <label>
              GST Calculation Method
              <select
                name="gstCalculationMethod"
                value={form.gstCalculationMethod || "service_charge_only"}
                onChange={handleChange}
              >
                <option value="service_charge_only">Service Charge + 18% GST on Service Charge</option>
                <option value="full_amount">18% GST on Entire Bill Amount</option>
              </select>
            </label>
            <label>
              Amount received
              <input
                type="number"
                name="amountReceived"
                value={form.amountReceived}
                onChange={handleChange}
                placeholder="0"
              />
            </label>
            <div>
              <button type="submit">{editingInvoiceId ? "Update invoice" : "Generate invoice"}</button>
              {editingInvoiceId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingInvoiceId(null);
                    setForm({
                      bookingId: "",
                      invoiceNumber: "",
                      invoiceDate: "",
                      baseSellingAmount: "",
                      serviceCharge: "",
                      amountReceived: "",
                      gstCalculationMethod: "service_charge_only",
                    });
                  }}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Cancel
                </button>
              )}
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
        <div className="card">
          <div className="card-header">
            <h2>Invoice list</h2>
            <button onClick={loadInvoices} disabled={loading}>
              Refresh
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Base Amount</th>
                <th>Service Charge</th>
                <th>GST</th>
                <th>Total</th>
                <th>Received</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : ""}</td>
                  <td>{inv.customerId?.companyName || inv.customerId?.name || ""}</td>
                  <td>{inv.baseSellingAmount}</td>
                  <td>{inv.serviceCharge}</td>
                  <td>
                    {inv.gstType === "sgst_cgst"
                      ? `SGST: ${inv.sgst || 0}, CGST: ${inv.cgst || 0}`
                      : `IGST: ${inv.igst || inv.serviceChargeGst18 || 0}`}
                  </td>
                  <td>{inv.totalAmount}</td>
                  <td>{inv.amountReceived}</td>
                  <td>{inv.remainingAmount}</td>
                  <td>{inv.paymentStatus}</td>
                  <td>
                    <button onClick={() => handleViewInvoice(inv._id)} style={{ marginRight: "0.5rem" }}>
                      View
                    </button>
                    <button onClick={() => handleEditInvoice(inv)}>Edit</button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={11}>No invoices yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedInvoice && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <h2>Invoice #{selectedInvoice.invoiceNumber}</h2>
            <button onClick={() => setSelectedInvoice(null)}>Close</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3>Customer-facing invoice</h3>
                <div>
                  <button
                    onClick={() => window.open(`${API_BASE}/api/invoices/${selectedInvoice._id}/export/csv`, "_blank")}
                    style={{ marginRight: "0.5rem", background: "#059669" }}
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => window.open(`${API_BASE}/api/invoices/${selectedInvoice._id}/export/docx`, "_blank")}
                    style={{ background: "#2563eb" }}
                  >
                    Export DOCX
                  </button>
                </div>
              </div>
              <div style={{ border: "1px solid #e5e7eb", padding: "1.5rem", borderRadius: "0.5rem" }}>
                {settings && (
                  <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
                    <strong style={{ fontSize: "1.1rem" }}>{settings.companyName || "Travel Agency"}</strong>
                    {settings.address && (
                      <>
                        <br />
                        <span>{settings.address}</span>
                      </>
                    )}
                    {(settings.city || settings.state || settings.pincode) && (
                      <>
                        <br />
                        <span>
                          {[settings.city, settings.state, settings.pincode].filter(Boolean).join(", ")}
                        </span>
                      </>
                    )}
                    {settings.contactNumber && (
                      <>
                        <br />
                        <span>Phone: {settings.contactNumber}</span>
                      </>
                    )}
                    {settings.email && (
                      <>
                        <br />
                        <span>Email: {settings.email}</span>
                      </>
                    )}
                    {settings.gstin && (
                      <>
                        <br />
                        <span>GSTIN: {settings.gstin}</span>
                      </>
                    )}
                  </div>
                )}
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Invoice Number:</strong> {selectedInvoice.invoiceNumber}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Date:</strong> {selectedInvoice.invoiceDate ? new Date(selectedInvoice.invoiceDate).toLocaleDateString() : ""}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Customer:</strong> {selectedInvoice.customerId?.companyName || selectedInvoice.customerId?.name || ""}
                  {selectedInvoice.customerId?.name && selectedInvoice.customerId?.companyName && (
                    <span> ({selectedInvoice.customerId.name})</span>
                  )}
                  <br />
                  {selectedInvoice.customerId?.address && (
                    <>
                      <span>Address: {selectedInvoice.customerId.address}</span>
                      <br />
                    </>
                  )}
                  {selectedInvoice.customerId?.phone && <span>Phone: {selectedInvoice.customerId.phone}</span>}
                  <br />
                  {selectedInvoice.customerId?.email && <span>Email: {selectedInvoice.customerId.email}</span>}
                  <br />
                  {selectedInvoice.customerGstin && <span>GSTIN: {selectedInvoice.customerGstin}</span>}
                </div>
                <div style={{ marginBottom: "1rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Base Selling Amount:</span>
                    <span>{selectedInvoice.baseSellingAmount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Service Charge:</span>
                    <span>{selectedInvoice.serviceCharge}</span>
                  </div>
                  {selectedInvoice.gstType === "sgst_cgst" ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span>SGST (9% on Service Charge):</span>
                        <span>{selectedInvoice.sgst || 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span>CGST (9% on Service Charge):</span>
                        <span>{selectedInvoice.cgst || 0}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span>IGST (18% on Service Charge):</span>
                      <span>{selectedInvoice.igst || selectedInvoice.serviceChargeGst18 || 0}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid #111827", fontWeight: "bold" }}>
                    <span>Total Amount:</span>
                    <span>{selectedInvoice.totalAmount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                    <span>Amount Received:</span>
                    <span>{selectedInvoice.amountReceived}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontWeight: "bold" }}>
                    <span>Remaining Amount:</span>
                    <span>{selectedInvoice.remainingAmount}</span>
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <strong>Payment Status:</strong> {selectedInvoice.paymentStatus}
                  </div>
                  {settings && settings.banks && settings.banks.length > 0 && (
                    <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                      <strong>Bank Details for Payment:</strong>
                      {settings.banks.map((bank, index) => (
                        <div key={index} style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
                          {bank.bankName && <div><strong>Bank {index + 1}:</strong> {bank.bankName}</div>}
                          {bank.bankAccountNumber && <div>Account Number: {bank.bankAccountNumber}</div>}
                          {bank.ifscCode && <div>IFSC Code: {bank.ifscCode}</div>}
                          {bank.branchName && <div>Branch: {bank.branchName}</div>}
                          {bank.branchCity && <div>Branch City: {bank.branchCity}</div>}
                          {bank.upiId && <div><strong>UPI ID:</strong> {bank.upiId}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3>Internal details (not shown to customer)</h3>
              <div style={{ border: "1px solid #e5e7eb", padding: "1.5rem", borderRadius: "0.5rem", background: "#f9fafb" }}>
                {(() => {
                  const bookingIds = selectedInvoice.bookingIds || [];
                  const firstBooking = bookingIds[0] || {};
                  return (
                    <>
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>Booking Type:</strong> {firstBooking?.type || ""}
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>Supplier Cost:</strong> {firstBooking?.supplierCost || 0}
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>True Cost:</strong> {firstBooking?.trueCost || 0}
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>Profit/Loss:</strong>{" "}
                        <span style={{ color: (firstBooking?.profit || 0) >= 0 ? "#059669" : "#dc2626" }}>
                          {firstBooking?.profit || 0}
                        </span>
                      </div>
                    </>
                  );
                })()}
                <div style={{ marginTop: "1.5rem" }}>
                  <h4>Update payment received</h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const amount = e.target.amount.value;
                      handleUpdatePayment(selectedInvoice._id, amount);
                    }}
                  >
                    <label>
                      Amount received
                      <input
                        type="number"
                        name="amount"
                        defaultValue={selectedInvoice.amountReceived}
                        required
                      />
                    </label>
                    <button type="submit" style={{ marginTop: "0.5rem" }}>
                      Update payment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

