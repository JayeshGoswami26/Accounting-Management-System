import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

const INDIAN_STATES_GST = [
  { name: "Andaman & Nicobar Islands", code: "35" },
  { name: "Andhra Pradesh", code: "37" },
  { name: "Arunachal Pradesh", code: "12" },
  { name: "Assam", code: "18" },
  { name: "Bihar", code: "10" },
  { name: "Chandigarh", code: "04" },
  { name: "Chhattisgarh", code: "22" },
  { name: "Dadra & Nagar Haveli and Daman & Diu", code: "26" },
  { name: "Delhi", code: "07" },
  { name: "Goa", code: "30" },
  { name: "Gujarat", code: "24" },
  { name: "Haryana", code: "06" },
  { name: "Himachal Pradesh", code: "02" },
  { name: "Jammu & Kashmir", code: "01" },
  { name: "Jharkhand", code: "20" },
  { name: "Karnataka", code: "29" },
  { name: "Kerala", code: "32" },
  { name: "Ladakh", code: "38" },
  { name: "Lakshadweep", code: "31" },
  { name: "Madhya Pradesh", code: "23" },
  { name: "Maharashtra", code: "27" },
  { name: "Manipur", code: "14" },
  { name: "Meghalaya", code: "17" },
  { name: "Mizoram", code: "15" },
  { name: "Nagaland", code: "13" },
  { name: "Odisha", code: "21" },
  { name: "Other Territory", code: "97" },
  { name: "Puducherry", code: "34" },
  { name: "Punjab", code: "03" },
  { name: "Rajasthan", code: "08" },
  { name: "Sikkim", code: "11" },
  { name: "Tamil Nadu", code: "33" },
  { name: "Telangana", code: "36" },
  { name: "Tripura", code: "16" },
  { name: "Uttar Pradesh", code: "09" },
  { name: "Uttarakhand", code: "05" },
  { name: "West Bengal", code: "19" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    stateCode: "",
    reference: "",
    gstin: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/customers");
      setCustomers(data);
    } catch (e) {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name || "",
      companyName: customer.companyName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      stateCode: customer.stateCode || "",
      reference: customer.reference || "",
      gstin: customer.gstin || customer.gstNumber || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      stateCode: "",
      reference: "",
      gstin: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await apiPut(`/api/customers/${editingId}`, form);
        setEditingId(null);
      } else {
        await apiPost("/api/customers", form);
      }
      setForm({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        stateCode: "",
        reference: "",
        gstin: "",
      });
      await loadCustomers();
    } catch (e) {
      setError("Failed to save customer");
    }
  };

  const handleDelete = async (customerId) => {
    if (!confirm("Delete this customer and ALL associated bookings, payments, and invoices? This cannot be undone.")) {
      return;
    }
    setError("");
    try {
      await apiDelete(`/api/customers/${customerId}`);
      await loadCustomers();
      if (selectedCustomer === customerId) {
        setSelectedCustomer(null);
        setSummary(null);
      }
    } catch (e) {
      setError("Failed to delete customer");
    }
  };

  const loadSummary = async (customerId) => {
    setSelectedCustomer(customerId);
    setSummary(null);
    setError("");
    try {
      const data = await apiGet(`/api/customers/${customerId}/summary`);
      setSummary(data);
    } catch (e) {
      setError("Failed to load customer summary");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Customers</h1>
      </div>
      <div className="page-grid">
        <div className="card">
          <h2>{editingId ? "Edit customer" : "Add customer"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Company Name (for invoices)
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company name for invoices"
              />
            </label>
            <label>
              Email
              <input name="email" value={form.email} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Full address"
              />
            </label>
            <label>
              State (GST Code)
              <select
                name="stateCode"
                value={form.stateCode}
                onChange={handleChange}
                style={{ minHeight: "150px", maxHeight: "200px" }}
                size={10}
              >
                <option value="">Select state</option>
                {INDIAN_STATES_GST.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name} - {state.code}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reference
              <input name="reference" value={form.reference} onChange={handleChange} />
            </label>
            <label>
              GSTIN Number
              <input
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                placeholder="15-character alphanumeric"
                pattern="[A-Z0-9]{15}"
                maxLength={15}
                style={{ textTransform: "uppercase" }}
              />
            </label>
            <div>
              <button type="submit">{editingId ? "Update customer" : "Save customer"}</button>
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
            <h2>Customer list</h2>
            <button onClick={loadCustomers} disabled={loading}>
              Refresh
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Reference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.reference}</td>
                  <td>
                    <button onClick={() => loadSummary(c._id)} style={{ marginRight: "0.5rem" }}>
                      View
                    </button>
                    <button onClick={() => handleEdit(c)} style={{ marginRight: "0.5rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5}>No customers yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {summary && (
        <div className="card">
          <h2>Customer summary</h2>
          <p>
            Name: {summary.customer.name} | Phone: {summary.customer.phone} | Email: {summary.customer.email}
          </p>
          <p>
            Total profit: {summary.totalProfit} | Outstanding balance: {summary.outstanding}
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Travel date</th>
                <th>Sold</th>
                <th>Supplier cost</th>
                <th>Profit</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {summary.bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.type}</td>
                  <td>{b.from}</td>
                  <td>{b.to}</td>
                  <td>{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : ""}</td>
                  <td>{b.soldAt}</td>
                  <td>{b.supplierCost}</td>
                  <td>{b.profit}</td>
                  <td>{b.remainingBalance}</td>
                </tr>
              ))}
              {summary.bookings.length === 0 && (
                <tr>
                  <td colSpan={8}>No bookings for this customer yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
