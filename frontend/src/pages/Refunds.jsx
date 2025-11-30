import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

const canViewAuditTrail = () => {
  const user = getCurrentUser();
  return user && ["admin", "manager"].includes(user.role);
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredCustomersForForm, setFilteredCustomersForForm] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    bookingId: "",
    amount: "",
    date: "",
    method: "cash",
    accountOrCompany: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    customerId: "",
    bookingId: "",
    method: "",
    fromDate: "",
    toDate: "",
  });
  const [filterCustomerSearch, setFilterCustomerSearch] = useState("");
  const [showFilterCustomerDropdown, setShowFilterCustomerDropdown] = useState(false);

  const loadRefunds = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "";
      const params = [];
      if (filters.customerId) params.push(`customerId=${filters.customerId}`);
      if (filters.bookingId) params.push(`bookingId=${filters.bookingId}`);
      if (filters.method) params.push(`method=${filters.method}`);
      if (params.length > 0) query = "?" + params.join("&");
      const data = await apiGet(`/api/refunds${query}`);
      let filtered = data;
      if (filters.fromDate || filters.toDate) {
        filtered = data.filter((r) => {
          if (!r.date) return false;
          const refundDate = new Date(r.date);
          if (filters.fromDate && refundDate < new Date(filters.fromDate)) return false;
          if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            toDate.setHours(23, 59, 59, 999);
            if (refundDate > toDate) return false;
          }
          return true;
        });
      }
      setRefunds(filtered);
    } catch (e) {
      setError("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await apiGet("/api/bookings");
      setBookings(data);
    } catch (e) {
      setError("Failed to load bookings");
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await apiGet("/api/customers");
      setCustomers(data);
    } catch (e) {
      setError("Failed to load customers");
    }
  };

  useEffect(() => {
    loadRefunds();
    loadBookings();
    loadCustomers();
  }, []);

  useEffect(() => {
    loadRefunds();
  }, [filters]);

  useEffect(() => {
    setFilteredCustomers(customers);
    setFilteredCustomersForForm(customers);
  }, [customers]);

  useEffect(() => {
    if (customerSearch.trim() === "") {
      setFilteredCustomersForForm(customers);
    } else {
      const search = customerSearch.toLowerCase();
      const filtered = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.phone?.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search)
      );
      setFilteredCustomersForForm(filtered);
    }
  }, [customerSearch, customers]);

  useEffect(() => {
    if (filterCustomerSearch.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const search = filterCustomerSearch.toLowerCase();
      const filtered = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.phone?.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search)
      );
      setFilteredCustomers(filtered);
    }
  }, [filterCustomerSearch, customers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('label[style*="position: relative"]')) {
        setShowCustomerDropdown(false);
        setShowFilterCustomerDropdown(false);
      }
    };
    if (showCustomerDropdown || showFilterCustomerDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showCustomerDropdown, showFilterCustomerDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // If booking is selected, auto-fill customerId from booking
    if (name === "bookingId" && value) {
      const booking = bookings.find((b) => b._id === value);
      if (booking) {
        const customerId = booking.customerId?._id || booking.customerId;
        if (customerId) {
          const customer = customers.find((c) => c._id === customerId);
          setForm((prev) => ({ ...prev, customerId: customerId, bookingId: value }));
          if (customer) {
            setCustomerSearch(customer.name || "");
          }
        }
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "customerId") {
      setFilterCustomerSearch(customers.find((c) => c._id === value)?.name || "");
      setShowFilterCustomerDropdown(false);
      if (value !== filters.customerId) {
        setFilters((prev) => ({ ...prev, bookingId: "" }));
      }
    }
  };

  const handleFilterCustomerSelect = (customer) => {
    setFilters((prev) => ({ ...prev, customerId: customer._id, bookingId: "" }));
    setFilterCustomerSearch(customer.name || "");
    setShowFilterCustomerDropdown(false);
    const input = document.querySelector('input[placeholder*="Search customer"]');
    if (input) {
      input.blur();
    }
  };

  const handleCustomerSelect = (customer) => {
    setForm((prev) => ({ ...prev, customerId: customer._id, bookingId: "" }));
    setCustomerSearch(customer.name || "");
    setShowCustomerDropdown(false);
    const input = document.querySelector('input[placeholder*="Select customer"]');
    if (input) {
      input.blur();
    }
  };

  const handleEdit = (refund) => {
    setEditingId(refund._id);
    setForm({
      customerId: refund.customerId?._id || refund.customerId || "",
      bookingId: refund.bookingId?._id || refund.bookingId || "",
      amount: refund.amount || "",
      date: refund.date ? new Date(refund.date).toISOString().split("T")[0] : "",
      method: refund.method || "cash",
      accountOrCompany: refund.accountOrCompany || "",
      note: refund.note || "",
    });
    const customer = customers.find((c) => c._id === (refund.customerId?._id || refund.customerId));
    if (customer) {
      setCustomerSearch(customer.name || "");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      customerId: "",
      bookingId: "",
      amount: "",
      date: "",
      method: "cash",
      accountOrCompany: "",
      note: "",
    });
    setCustomerSearch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.customerId || !form.bookingId || !form.amount || !form.date) {
      setError("Customer, booking, amount, and date are required");
      return;
    }
    const body = {
      customerId: form.customerId,
      bookingId: form.bookingId,
      amount: Number(form.amount),
      date: form.date ? new Date(form.date) : new Date(),
      method: form.method,
      accountOrCompany: form.accountOrCompany,
      note: form.note,
    };
    try {
      if (editingId) {
        await apiPut(`/api/refunds/${editingId}`, body);
        setEditingId(null);
      } else {
        await apiPost("/api/refunds", body);
      }
      handleCancelEdit();
      await loadRefunds();
      await loadBookings();
    } catch (e) {
      setError("Failed to save refund");
    }
  };

  const handleDelete = async (refundId) => {
    if (!confirm("Delete this refund? This will update the booking balance.")) {
      return;
    }
    setError("");
    try {
      await apiDelete(`/api/refunds/${refundId}`);
      await loadRefunds();
      await loadBookings();
    } catch (e) {
      setError("Failed to delete refund");
    }
  };

  const totalAmount = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Refunds</h1>
      </div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Filters</h2>
        <div className="form-grid">
          <label style={{ gridColumn: "1 / -1", position: "relative" }}>
            Customer
            <input
              type="text"
              placeholder="Search customer by name, phone, email..."
              value={filterCustomerSearch}
              onChange={(e) => {
                setFilterCustomerSearch(e.target.value);
                if (e.target.value.trim() !== "") {
                  setShowFilterCustomerDropdown(true);
                }
              }}
              onFocus={() => {
                if (!filters.customerId) {
                  setShowFilterCustomerDropdown(true);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!filters.customerId) {
                  setShowFilterCustomerDropdown(true);
                }
              }}
              readOnly={!!filters.customerId}
              style={!filters.customerId ? {} : { cursor: filters.customerId ? "default" : "text" }}
            />
            {filters.customerId && (
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, customerId: "", bookingId: "" }));
                  setFilterCustomerSearch("");
                  setShowFilterCustomerDropdown(false);
                }}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Clear
              </button>
            )}
            {showFilterCustomerDropdown && filteredCustomers.length > 0 && !filters.customerId && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                  marginTop: "0.25rem",
                }}
              >
                {filteredCustomers.slice(0, 20).map((c) => (
                  <div
                    key={c._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterCustomerSelect(c);
                    }}
                    style={{
                      padding: "0.5rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
                    onMouseLeave={(e) => (e.target.style.background = "white")}
                  >
                    {c.name} {c.phone ? `(${c.phone})` : ""} {c.email ? `- ${c.email}` : ""}
                  </div>
                ))}
                {filteredCustomers.length > 20 && (
                  <div style={{ padding: "0.5rem", color: "#6b7280", fontSize: "0.85rem" }}>
                    Showing first 20 of {filteredCustomers.length} results
                  </div>
                )}
              </div>
            )}
          </label>
          <label>
            Booking
            <select name="bookingId" value={filters.bookingId} onChange={handleFilterChange}>
              <option value="">All bookings</option>
              {bookings
                .filter((b) => !filters.customerId || b.customerId?._id === filters.customerId || b.customerId === filters.customerId)
                .map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.customerId?.name || ""} - {b.type} - {b.soldAt}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Refund method
            <select name="method" value={filters.method} onChange={handleFilterChange}>
              <option value="">All methods</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </label>
          <label>
            From date
            <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          </label>
          <label>
            To date
            <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          </label>
        </div>
      </div>
      <div className="page-grid">
        <div className="card">
          <h2>{editingId ? "Edit refund" : "Add refund"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label style={{ gridColumn: "1 / -1", position: "relative" }}>
              Customer <span style={{ color: "#dc2626" }}>*</span>
              <input
                type="text"
                placeholder="Select customer"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                }}
                onFocus={() => {
                  if (!form.customerId) {
                    setShowCustomerDropdown(true);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!form.customerId) {
                    setShowCustomerDropdown(true);
                  }
                }}
                readOnly={!!form.customerId}
                required
                style={!form.customerId ? {} : { cursor: form.customerId ? "default" : "text" }}
              />
              {form.customerId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, customerId: "", bookingId: "" }));
                    setCustomerSearch("");
                    setShowCustomerDropdown(false);
                  }}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Clear
                </button>
              )}
              {showCustomerDropdown && !form.customerId && filteredCustomersForForm.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    marginTop: "0.25rem",
                  }}
                >
                  {filteredCustomersForForm.slice(0, 20).map((c) => (
                    <div
                      key={c._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomerSelect(c);
                      }}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
                      onMouseLeave={(e) => (e.target.style.background = "white")}
                    >
                      {c.name} {c.phone ? `(${c.phone})` : ""} {c.email ? `- ${c.email}` : ""}
                    </div>
                  ))}
                  {filteredCustomersForForm.length > 20 && (
                    <div style={{ padding: "0.5rem", color: "#6b7280", fontSize: "0.85rem" }}>
                      Showing first 20 of {filteredCustomersForForm.length} results
                    </div>
                  )}
                </div>
              )}
            </label>
            <label>
              Booking <span style={{ color: "#dc2626" }}>*</span>
              <select
                name="bookingId"
                value={form.bookingId}
                onChange={handleChange}
                required
              >
                <option value="">Select booking</option>
                {bookings
                  .filter((b) => !form.customerId || b.customerId?._id === form.customerId || b.customerId === form.customerId)
                  .map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.customerId?.name || ""} - {b.type} - {b.soldAt} (Remaining: {b.remainingBalance})
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Refund Amount <span style={{ color: "#dc2626" }}>*</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </label>
            <label>
              Refund Date <span style={{ color: "#dc2626" }}>*</span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                onClick={(e) => e.target.showPicker?.()}
                style={{ cursor: "pointer" }}
              />
            </label>
            <label>
              Refund Method <span style={{ color: "#dc2626" }}>*</span>
              <select name="method" value={form.method} onChange={handleChange} required>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </label>
            {form.method && (
              <label>
                {form.method === "credit_card" ? "Credit Card Portal" : form.method === "bank_transfer" ? "Bank Account" : form.method === "upi" ? "UPI ID / Account" : form.method === "cheque" ? "Cheque Number / Bank" : "Account / Details"}
                <input
                  name="accountOrCompany"
                  value={form.accountOrCompany}
                  onChange={handleChange}
                  placeholder={form.method === "credit_card" ? "e.g., HDFC Credit Card, ICICI Credit Card" : form.method === "bank_transfer" ? "e.g., HDFC Bank - Savings, SBI Current" : form.method === "upi" ? "e.g., UPI ID or Account name" : form.method === "cheque" ? "e.g., Cheque number and bank name" : "Enter account or details"}
                />
              </label>
            )}
            <label>
              Note
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes about the refund"
              />
            </label>
            <div>
              <button type="submit">{editingId ? "Update refund" : "Save refund"}</button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "0.5rem" }}>
                  Cancel
                </button>
              )}
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
        <div className="card">
          <div className="card-header">
            <h2>Refund list</h2>
            <div>
              <strong>Total: {totalAmount}</strong>
              <button onClick={loadRefunds} disabled={loading} style={{ marginLeft: "1rem" }}>
                Refresh
              </button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Booking</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Account/Details</th>
                {canViewAuditTrail() && <th>Created by</th>}
                {canViewAuditTrail() && <th>Updated by</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r._id}>
                  <td>{r.date ? new Date(r.date).toLocaleDateString() : ""}</td>
                  <td>{r.customerId?.name || ""}</td>
                  <td>
                    {r.bookingId?.type || ""} - {r.bookingId?.soldAt || ""}
                  </td>
                  <td style={{ color: "#dc2626" }}>{r.amount}</td>
                  <td>
                    {r.method === "credit_card" ? "Credit Card" : 
                     r.method === "bank_transfer" ? "Bank Transfer" : 
                     r.method === "upi" ? "UPI" : 
                     r.method === "cheque" ? "Cheque" : 
                     r.method === "cash" ? "Cash" : 
                     r.method || "N/A"}
                  </td>
                  <td>{r.accountOrCompany}</td>
                  {canViewAuditTrail() && (
                    <td style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {r.createdBy ? (r.createdBy.name || r.createdBy.username || "N/A") : "N/A"}
                    </td>
                  )}
                  {canViewAuditTrail() && (
                    <td style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {r.updatedBy ? (r.updatedBy.name || r.updatedBy.username || "N/A") : "N/A"}
                    </td>
                  )}
                  <td>
                    <button onClick={() => handleEdit(r)} style={{ marginRight: "0.5rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(r._id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {refunds.length === 0 && (
                <tr>
                  <td colSpan={canViewAuditTrail() ? 9 : 7}>No refunds found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

