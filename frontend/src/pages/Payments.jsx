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

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredCustomersForForm, setFilteredCustomersForForm] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [form, setForm] = useState({
    bookingId: "",
    customerId: "",
    amount: "",
    date: "",
    method: "cash",
    accountOrCompany: "",
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

  const loadPayments = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "";
      const params = [];
      if (filters.customerId) params.push(`customerId=${filters.customerId}`);
      if (filters.bookingId) params.push(`bookingId=${filters.bookingId}`);
      if (filters.method) params.push(`method=${filters.method}`);
      if (params.length > 0) query = "?" + params.join("&");
      const data = await apiGet(`/api/payments${query}`);
      let filtered = data;
      if (filters.fromDate || filters.toDate) {
        filtered = data.filter((p) => {
          if (!p.date) return false;
          const paymentDate = new Date(p.date);
          if (filters.fromDate && paymentDate < new Date(filters.fromDate)) return false;
          if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            toDate.setHours(23, 59, 59, 999);
            if (paymentDate > toDate) return false;
          }
          return true;
        });
      }
      setPayments(filtered);
    } catch (e) {
      setError("Failed to load payments");
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
    loadPayments();
    loadBookings();
    loadCustomers();
  }, []);

  useEffect(() => {
    loadPayments();
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
      // Clear booking filter when customer changes
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
    setForm((prev) => ({ ...prev, customerId: customer._id }));
    setCustomerSearch(customer.name || "");
    setShowCustomerDropdown(false);
    const input = document.querySelector('input[placeholder*="Select customer"]');
    if (input) {
      input.blur();
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment._id);
    setForm({
      bookingId: payment.bookingId?._id || payment.bookingId || "",
      customerId: payment.customerId?._id || payment.customerId || "",
      amount: payment.amount || "",
      date: payment.date ? new Date(payment.date).toISOString().split("T")[0] : "",
      method: payment.method || "cash",
      accountOrCompany: payment.accountOrCompany || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      bookingId: "",
      customerId: "",
      amount: "",
      date: "",
      method: "cash",
      accountOrCompany: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.bookingId || !form.amount) {
      setError("Booking and amount are required");
      return;
    }
    const body = {
      bookingId: form.bookingId,
      customerId: form.customerId || form.bookingId,
      amount: Number(form.amount),
      date: form.date ? new Date(form.date) : new Date(),
      method: form.method,
      accountOrCompany: form.accountOrCompany,
    };
    try {
      if (editingId) {
        await apiPut(`/api/payments/${editingId}`, body);
        setEditingId(null);
      } else {
        await apiPost("/api/payments", body);
      }
      handleCancelEdit();
      await loadPayments();
      await loadBookings();
    } catch (e) {
      setError("Failed to save payment");
    }
  };

  const handleDelete = async (paymentId) => {
    if (!confirm("Delete this payment? This will update the booking balance.")) {
      return;
    }
    setError("");
    try {
      await apiDelete(`/api/payments/${paymentId}`);
      await loadPayments();
      await loadBookings();
    } catch (e) {
      setError("Failed to delete payment");
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Payments</h1>
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
                setShowFilterCustomerDropdown(true);
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
                    onClick={() => handleFilterCustomerSelect(c)}
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
            Payment method
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
          <h2>{editingId ? "Edit payment" : "Add payment"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Booking
              <select name="bookingId" value={form.bookingId} onChange={handleChange} required>
                <option value="">Select booking</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.customerId?.name || ""} - {b.type} - {b.soldAt} (Remaining: {b.remainingBalance})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Amount
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Payment date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
            <label>
              Method
              <select name="method" value={form.method} onChange={handleChange}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </label>
            <label>
              Account / Company
              <input
                name="accountOrCompany"
                value={form.accountOrCompany}
                onChange={handleChange}
              />
            </label>
            <div>
              <button type="submit">{editingId ? "Update payment" : "Save payment"}</button>
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
            <h2>Payment list</h2>
            <div>
              <strong>Total: {totalAmount}</strong>
              <button onClick={loadPayments} disabled={loading} style={{ marginLeft: "1rem" }}>
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
                <th>Account/Company</th>
                {canViewAuditTrail() && <th>Created by</th>}
                {canViewAuditTrail() && <th>Updated by</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.date ? new Date(p.date).toLocaleDateString() : ""}</td>
                  <td>{p.customerId?.name || p.bookingId?.customerId?.name || ""}</td>
                  <td>
                    {p.bookingId?.type || ""} - {p.bookingId?.soldAt || ""}
                  </td>
                  <td style={{ color: p.amount < 0 ? "#dc2626" : "inherit", fontWeight: p.amount < 0 ? "bold" : "normal" }}>
                    {p.amount < 0 ? `-${Math.abs(p.amount)} (Refund)` : p.amount}
                  </td>
                  <td>
                    {p.method === "credit_card" ? "Credit Card" : 
                     p.method === "bank_transfer" ? "Bank Transfer" : 
                     p.method === "upi" ? "UPI" : 
                     p.method === "cheque" ? "Cheque" : 
                     p.method === "cash" ? "Cash" : 
                     p.method || "N/A"}
                  </td>
                  <td>{p.accountOrCompany || (p.note && p.note.startsWith("Refund:") ? p.note.replace("Refund: ", "") : "")}</td>
                  {canViewAuditTrail() && (
                    <td style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {p.createdBy ? (p.createdBy.name || p.createdBy.username || "N/A") : "N/A"}
                    </td>
                  )}
                  {canViewAuditTrail() && (
                    <td style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {p.updatedBy ? (p.updatedBy.name || p.updatedBy.username || "N/A") : "N/A"}
                    </td>
                  )}
                  <td>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: "0.5rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7}>No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

