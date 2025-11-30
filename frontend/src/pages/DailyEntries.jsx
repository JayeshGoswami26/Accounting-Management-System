import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user can view audit trail
const canViewAuditTrail = () => {
  const user = getCurrentUser();
  return user && ["admin", "manager"].includes(user.role);
};

export default function DailyEntriesPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    customerId: "",
    travelerName: "",
    type: "flight",
    from: "",
    to: "",
    checkInDate: "",
    checkOutDate: "",
    startDate: "",
    endDate: "",
    city: "",
    airlineOrHotel: "",
    pnr: "",
    tripId: "",
    bookingDate: "",
    travelDate: "",
    portal: "",
    details: "",
    bookingType: "Normal",
    isCancelled: false,
    isRescheduled: false,
    chargesToPayAirline: "",
    chargesToCollectFromCustomer: "",
    fullRefundIssued: false,
    serviceChargeOnRefund: "",
    hotelReconfirmed: false,
    freeCancellationTillDate: "",
    hotelCancelled: false,
    hotelRefundProcessed: false,
    soldAt: "",
    supplierCost: "",
    feesAdjustments: "",
    totalReceived: "",
    paymentMethod: "",
    paymentAccountOrPortal: "",
    customFields: {},
  });
  const [editingId, setEditingId] = useState(null);
  const [customFieldKey, setCustomFieldKey] = useState("");
  const [customFieldValue, setCustomFieldValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    bookingId: "",
    amount: "",
    date: "",
    method: "cash",
    accountOrCompany: "",
  });

  const loadCustomers = async () => {
    try {
      const data = await apiGet("/api/customers");
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (e) {
      setError("Failed to load customers");
    }
  };

  const loadBookings = async () => {
    try {
      const data = await apiGet("/api/bookings");
      setBookings(data);
      setError("");
    } catch (e) {
      console.error("Error loading bookings:", e);
      setError(`Failed to load bookings: ${e.message || "Unknown error"}`);
    }
  };

  const loadPayments = async (bookingId) => {
    try {
      const data = await apiGet(`/api/payments?bookingId=${bookingId}`);
      setPayments(data);
    } catch (e) {
      setError("Failed to load payments");
    }
  };

  useEffect(() => {
    loadCustomers();
    loadBookings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('label[style*="position: relative"]')) {
        setShowCustomerDropdown(false);
      }
    };
    if (showCustomerDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showCustomerDropdown]);

  useEffect(() => {
    if (customerSearch.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const search = customerSearch.toLowerCase();
      const filtered = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.phone?.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search) ||
          c.reference?.toLowerCase().includes(search)
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearch, customers]);

  const handleCustomerSelect = (customer) => {
    setForm((prev) => ({ ...prev, customerId: customer._id, travelerName: "" }));
    setCustomerSearch(customer.name || "");
    setShowCustomerDropdown(false);
    const input = document.querySelector('input[placeholder*="Search customer"]');
    if (input) {
      input.blur();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomFieldAdd = () => {
    if (!customFieldKey.trim() || !customFieldValue.trim()) return;
    const numValue = Number(customFieldValue);
    if (isNaN(numValue)) {
      setError("Custom field value must be a number");
      return;
    }
    setForm((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [customFieldKey]: numValue,
      },
    }));
    setCustomFieldKey("");
    setCustomFieldValue("");
    setError("");
  };

  const handleCustomFieldRemove = (key) => {
    const newFields = { ...form.customFields };
    delete newFields[key];
    setForm((prev) => ({ ...prev, customFields: newFields }));
  };

  const validateCustomFields = () => {
    if (form.type === "package" || form.type === "other") {
      const sum = Object.values(form.customFields || {}).reduce((acc, val) => acc + Number(val || 0), 0);
      const supplierCost = Number(form.supplierCost) || 0;
      if (Math.abs(sum - supplierCost) > 0.01) {
        setError(`Sum of custom fields (${sum}) must equal supplier cost (${supplierCost})`);
        return false;
      }
    }
    return true;
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    const customer = customers.find((c) => c._id === booking.customerId?._id || c._id === booking.customerId);
    setForm({
      customerId: booking.customerId?._id || booking.customerId || "",
      type: booking.type || "flight",
      from: booking.from || "",
      to: booking.to || "",
      checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split("T")[0] : "",
      checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().split("T")[0] : "",
      startDate: booking.startDate ? new Date(booking.startDate).toISOString().split("T")[0] : "",
      endDate: booking.endDate ? new Date(booking.endDate).toISOString().split("T")[0] : "",
      city: booking.city || "",
      airlineOrHotel: booking.airlineOrHotel || "",
      pnr: booking.pnr || "",
      tripId: booking.tripId || "",
      bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString().split("T")[0] : "",
      travelDate: booking.travelDate ? new Date(booking.travelDate).toISOString().split("T")[0] : "",
      portal: booking.portal || "",
      details: booking.details || "",
      bookingType: booking.bookingType || "Normal",
      isCancelled: booking.isCancelled || false,
      isRescheduled: booking.isRescheduled || false,
      chargesToPayAirline: booking.chargesToPayAirline || "",
      chargesToCollectFromCustomer: booking.chargesToCollectFromCustomer || "",
      fullRefundIssued: booking.fullRefundIssued || false,
      serviceChargeOnRefund: booking.serviceChargeOnRefund || "",
      hotelReconfirmed: booking.hotelReconfirmed || false,
      freeCancellationTillDate: booking.freeCancellationTillDate ? new Date(booking.freeCancellationTillDate).toISOString().split("T")[0] : "",
      hotelCancelled: booking.hotelCancelled || false,
      hotelRefundProcessed: booking.hotelRefundProcessed || false,
      soldAt: booking.soldAt || "",
      supplierCost: booking.supplierCost || "",
      feesAdjustments: booking.feesAdjustments || "",
      totalReceived: booking.totalReceived || "",
      paymentMethod: booking.paymentMethod || "",
      paymentAccountOrPortal: booking.paymentAccountOrPortal || "",
      customFields: booking.customFields || {},
    });
    if (customer) {
      setCustomerSearch(customer.name || "");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      customerId: "",
      type: "flight",
      from: "",
      to: "",
      checkInDate: "",
      checkOutDate: "",
      startDate: "",
      endDate: "",
      city: "",
      airlineOrHotel: "",
      pnr: "",
      tripId: "",
      bookingDate: "",
      travelDate: "",
      portal: "",
      details: "",
      bookingType: "Normal",
      isCancelled: false,
      isRescheduled: false,
      chargesToPayAirline: "",
      chargesToCollectFromCustomer: "",
      fullRefundIssued: false,
      serviceChargeOnRefund: "",
      hotelReconfirmed: false,
      freeCancellationTillDate: "",
      hotelCancelled: false,
      hotelRefundProcessed: false,
      soldAt: "",
      supplierCost: "",
      feesAdjustments: "",
      totalReceived: "",
      paymentMethod: "",
      paymentAccountOrPortal: "",
      customFields: {},
    });
    setCustomerSearch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.customerId) {
      setError("Customer is required");
      return;
    }
    if (!form.soldAt) {
      setError("Sold at is required");
      return;
    }
    if (!form.supplierCost) {
      setError("Supplier cost is required");
      return;
    }
    if (!form.travelDate) {
      setError("Travel date is required");
      return;
    }
    if (!validateCustomFields()) {
      return;
    }
    const body = {
      customerId: form.customerId,
      type: form.type,
      from: form.type === "hotel" ? undefined : form.from,
      to: form.type === "hotel" ? undefined : form.to,
      checkInDate: form.type === "hotel" && form.checkInDate ? new Date(form.checkInDate) : undefined,
      checkOutDate: form.type === "hotel" && form.checkOutDate ? new Date(form.checkOutDate) : undefined,
      startDate: form.type === "package" && form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.type === "package" && form.endDate ? new Date(form.endDate) : undefined,
      city: form.type === "hotel" ? form.city : undefined,
      airlineOrHotel: form.airlineOrHotel,
      pnr: form.type === "hotel" ? undefined : form.pnr,
      tripId: form.tripId,
      bookingDate: form.bookingDate ? new Date(form.bookingDate) : undefined,
      travelDate: form.travelDate ? new Date(form.travelDate) : undefined,
      portal: form.portal,
      details: form.type === "package" ? form.details : undefined,
      bookingType: form.type === "flight" ? form.bookingType : undefined,
      isCancelled: form.type === "flight" ? form.isCancelled : undefined,
      isRescheduled: form.type === "flight" ? form.isRescheduled : undefined,
      chargesToPayAirline: form.type === "flight" && form.chargesToPayAirline ? Number(form.chargesToPayAirline) : undefined,
      chargesToCollectFromCustomer: form.type === "flight" && form.chargesToCollectFromCustomer ? Number(form.chargesToCollectFromCustomer) : undefined,
      fullRefundIssued: form.type === "flight" ? form.fullRefundIssued : undefined,
      serviceChargeOnRefund: form.type === "flight" && form.serviceChargeOnRefund ? Number(form.serviceChargeOnRefund) : undefined,
      hotelReconfirmed: form.type === "hotel" ? form.hotelReconfirmed : undefined,
      freeCancellationTillDate: form.type === "hotel" && form.freeCancellationTillDate ? new Date(form.freeCancellationTillDate) : undefined,
      hotelCancelled: form.type === "hotel" ? form.hotelCancelled : undefined,
      hotelRefundProcessed: form.type === "hotel" ? form.hotelRefundProcessed : undefined,
      soldAt: Number(form.soldAt),
      supplierCost: Number(form.supplierCost),
      feesAdjustments: form.feesAdjustments ? Number(form.feesAdjustments) : 0,
      paymentMethod: form.paymentMethod,
      paymentAccountOrPortal: form.paymentAccountOrPortal,
      customFields: (form.type === "package" || form.type === "other") ? form.customFields : undefined,
    };
    // For new bookings, allow initial payment
    if (!editingId && form.totalReceived) {
      body.totalReceived = Number(form.totalReceived);
    }
    // Note: For editing, totalReceived is recalculated from Payment records in backend
    if (form.type === "flight" && form.fullRefundIssued) {
      const originalSupplierCost = Number(form.supplierCost) || 0;
      const serviceCharge = form.serviceChargeOnRefund ? Number(form.serviceChargeOnRefund) : 0;
      body.soldAt = serviceCharge;
      body.supplierCost = 0;
      body.feesAdjustments = (body.feesAdjustments || 0) - originalSupplierCost;
    }
    try {
      if (editingId) {
        await apiPut(`/api/bookings/${editingId}`, body);
        setEditingId(null);
      } else {
        await apiPost("/api/bookings", body);
      }
      handleCancelEdit();
      await loadBookings();
    } catch (e) {
      setError("Failed to save booking");
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm("Delete this booking and ALL associated payments and invoices? This cannot be undone.")) {
      return;
    }
    setError("");
    try {
      await apiDelete(`/api/bookings/${bookingId}`);
      await loadBookings();
    } catch (e) {
      setError("Failed to delete booking");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!paymentForm.bookingId || !paymentForm.amount) {
      setError("Select booking and enter amount");
      return;
    }
    const body = {
      bookingId: paymentForm.bookingId,
      customerId: paymentForm.bookingId,
      amount: Number(paymentForm.amount),
      date: paymentForm.date ? new Date(paymentForm.date) : new Date(),
      method: paymentForm.method,
      accountOrCompany: paymentForm.accountOrCompany,
    };
    try {
      await apiPost("/api/payments", body);
      setPaymentForm({
        bookingId: "",
        amount: "",
        date: "",
        method: "cash",
        accountOrCompany: "",
      });
      await loadBookings();
      if (selectedBooking) {
        await loadPayments(selectedBooking);
      }
    } catch (e) {
      setError("Failed to save payment");
    }
  };

  const handleViewPayments = async (bookingId) => {
    setSelectedBooking(bookingId);
    setPaymentForm((prev) => ({ ...prev, bookingId }));
    await loadPayments(bookingId);
  };

  const selectedCustomer = customers.find((c) => c._id === form.customerId);
  const customFieldsSum = Object.values(form.customFields || {}).reduce((acc, val) => acc + Number(val || 0), 0);

  if (error && !loading) {
    console.error("DailyEntries error:", error);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Daily entries</h1>
        {error && <p style={{ color: "#dc2626", marginTop: "0.5rem" }}>{error}</p>}
      </div>
      {loading && <p>Loading...</p>}
      <div className="page-grid">
        <div className="card">
          <h2>{editingId ? "Edit booking" : "Add booking"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label style={{ gridColumn: "1 / -1", position: "relative" }}>
              Customer <span style={{ color: "#dc2626" }}>*</span>
              <input
                type="text"
                placeholder="Search customer by name, phone, email..."
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
                onClick={() => {
                  if (!form.customerId) {
                    setShowCustomerDropdown(true);
                  }
                }}
                required
                readOnly={!!form.customerId}
                style={!form.customerId ? { borderColor: "#dc2626" } : { cursor: form.customerId ? "default" : "text" }}
              />
              {form.customerId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, customerId: "", travelerName: "" }));
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
              {showCustomerDropdown && filteredCustomers.length > 0 && !form.customerId && (
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
                      onClick={() => handleCustomerSelect(c)}
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
              Traveller Name
              <input
                type="text"
                name="travelerName"
                value={form.travelerName}
                onChange={handleChange}
                placeholder="Enter traveller/employee name (optional)"
              />
            </label>
            <label>
              Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="flight">Flight</option>
                <option value="hotel">Hotel</option>
                <option value="package">Package</option>
                <option value="other">Other</option>
              </select>
            </label>
            {form.type === "flight" && (
              <>
                <label>
                  From
                  <input name="from" value={form.from} onChange={handleChange} />
                </label>
                <label>
                  To
                  <input name="to" value={form.to} onChange={handleChange} />
                </label>
                <label>
                  Booking type
                  <select name="bookingType" value={form.bookingType} onChange={handleChange}>
                    <option value="Normal">Normal</option>
                    <option value="SME">SME</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Flex">Flex</option>
                    <option value="Series Fare">Series Fare</option>
                    <option value="Non Refundable">Non Refundable</option>
                  </select>
                </label>
                {editingId && (
                  <>
                    <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        name="isCancelled"
                        checked={form.isCancelled}
                        onChange={handleChange}
                      />
                      <span>Flight cancelled</span>
                    </label>
                    <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        name="isRescheduled"
                        checked={form.isRescheduled}
                        onChange={handleChange}
                      />
                      <span>Flight rescheduled</span>
                    </label>
                    <label>
                      Charges to pay airline/portal
                      <input
                        type="number"
                        name="chargesToPayAirline"
                        value={form.chargesToPayAirline}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Charges to collect from customer
                      <input
                        type="number"
                        name="chargesToCollectFromCustomer"
                        value={form.chargesToCollectFromCustomer}
                        onChange={handleChange}
                      />
                    </label>
                    <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        name="fullRefundIssued"
                        checked={form.fullRefundIssued}
                        onChange={handleChange}
                      />
                      <span>Full refund issued from airline</span>
                    </label>
                    {form.fullRefundIssued && (
                      <label>
                        Service charge on refund
                        <input
                          type="number"
                          name="serviceChargeOnRefund"
                          value={form.serviceChargeOnRefund}
                          onChange={handleChange}
                        />
                      </label>
                    )}
                  </>
                )}
              </>
            )}
            {form.type === "hotel" && (
              <>
                <label>
                  City
                  <input name="city" value={form.city} onChange={handleChange} />
                </label>
                <label>
                  Check-in date
                  <input
                    type="date"
                    name="checkInDate"
                    value={form.checkInDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker?.()}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <label>
                  Check-out date
                  <input
                    type="date"
                    name="checkOutDate"
                    value={form.checkOutDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker?.()}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <label>
                  Free cancellation till date
                  <input
                    type="date"
                    name="freeCancellationTillDate"
                    value={form.freeCancellationTillDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker?.()}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    name="hotelReconfirmed"
                    checked={form.hotelReconfirmed}
                    onChange={handleChange}
                  />
                  <span>Reconfirmed with hotel</span>
                </label>
                {editingId && (
                  <>
                    <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        name="hotelCancelled"
                        checked={form.hotelCancelled}
                        onChange={handleChange}
                      />
                      <span>Hotel cancelled</span>
                    </label>
                    {form.hotelCancelled && (
                      <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          type="checkbox"
                          name="hotelRefundProcessed"
                          checked={form.hotelRefundProcessed}
                          onChange={handleChange}
                        />
                        <span>Full refund processed - No due from customer</span>
                      </label>
                    )}
                  </>
                )}
              </>
            )}
            {form.type === "package" && (
              <>
                <label>
                  Start date
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker?.()}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <label>
                  End date
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker?.()}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <label style={{ gridColumn: "1 / -1" }}>
                  Package description
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    rows={3}
                  />
                </label>
                <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                  <h3 style={{ marginTop: 0 }}>Custom fields (Required - Sum must equal Supplier Cost)</h3>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <input
                      placeholder="Field name (e.g., Cab service)"
                      value={customFieldKey}
                      onChange={(e) => setCustomFieldKey(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="number"
                      placeholder="Value"
                      value={customFieldValue}
                      onChange={(e) => setCustomFieldValue(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={handleCustomFieldAdd}>
                      +
                    </button>
                  </div>
                  {Object.entries(form.customFields || {}).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <span style={{ flex: 1, fontWeight: "bold" }}>{key}:</span>
                      <span style={{ flex: 1 }}>{value}</span>
                      <button type="button" onClick={() => handleCustomFieldRemove(key)} className="btn-danger">
                        Remove
                      </button>
                    </div>
                  ))}
                  <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
                    <strong>Sum of custom fields: {customFieldsSum}</strong> | <strong>Supplier cost: {form.supplierCost || 0}</strong>
                    {Math.abs(customFieldsSum - (Number(form.supplierCost) || 0)) > 0.01 && (
                      <span style={{ color: "#dc2626", marginLeft: "0.5rem" }}>⚠️ Must match!</span>
                    )}
                  </div>
                </div>
              </>
            )}
            {form.type === "other" && (
              <>
                <label>
                  From
                  <input name="from" value={form.from} onChange={handleChange} />
                </label>
                <label>
                  To
                  <input name="to" value={form.to} onChange={handleChange} />
                </label>
                <label style={{ gridColumn: "1 / -1" }}>
                  Details
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    rows={3}
                  />
                </label>
                <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                  <h3 style={{ marginTop: 0 }}>Custom fields (Required - Sum must equal Supplier Cost)</h3>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <input
                      placeholder="Field name (e.g., Cab service)"
                      value={customFieldKey}
                      onChange={(e) => setCustomFieldKey(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="number"
                      placeholder="Value"
                      value={customFieldValue}
                      onChange={(e) => setCustomFieldValue(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={handleCustomFieldAdd}>
                      +
                    </button>
                  </div>
                  {Object.entries(form.customFields || {}).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <span style={{ flex: 1, fontWeight: "bold" }}>{key}:</span>
                      <span style={{ flex: 1 }}>{value}</span>
                      <button type="button" onClick={() => handleCustomFieldRemove(key)} className="btn-danger">
                        Remove
                      </button>
                    </div>
                  ))}
                  <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#f3f4f6", borderRadius: "0.5rem" }}>
                    <strong>Sum of custom fields: {customFieldsSum}</strong> | <strong>Supplier cost: {form.supplierCost || 0}</strong>
                    {Math.abs(customFieldsSum - (Number(form.supplierCost) || 0)) > 0.01 && (
                      <span style={{ color: "#dc2626", marginLeft: "0.5rem" }}>⚠️ Must match!</span>
                    )}
                  </div>
                </div>
              </>
            )}
            <label>
              {form.type === "hotel" ? "Hotel name" : "Airline / Hotel"}
              <input
                name="airlineOrHotel"
                value={form.airlineOrHotel}
                onChange={handleChange}
              />
            </label>
            {form.type !== "hotel" && (
              <label>
                PNR
                <input name="pnr" value={form.pnr} onChange={handleChange} />
              </label>
            )}
            <label>
              Trip ID
              <input name="tripId" value={form.tripId} onChange={handleChange} />
            </label>
            <label>
              Booking date
              <input
                type="date"
                name="bookingDate"
                value={form.bookingDate}
                onChange={handleChange}
                onClick={(e) => e.target.showPicker?.()}
                style={{ cursor: "pointer" }}
              />
            </label>
            <label>
              Travel date <span style={{ color: "#dc2626" }}>*</span>
              <input
                type="date"
                name="travelDate"
                value={form.travelDate}
                onChange={handleChange}
                onClick={(e) => e.target.showPicker?.()}
                required
                style={!form.travelDate ? { borderColor: "#dc2626", cursor: "pointer" } : { cursor: "pointer" }}
              />
            </label>
            <label>
              Portal
              <input name="portal" value={form.portal} onChange={handleChange} />
            </label>
            <label>
              Sold at <span style={{ color: "#dc2626" }}>*</span>
              <input
                name="soldAt"
                type="number"
                value={form.soldAt}
                onChange={handleChange}
                required
                style={!form.soldAt ? { borderColor: "#dc2626" } : {}}
              />
            </label>
            <label>
              Supplier cost <span style={{ color: "#dc2626" }}>*</span>
              <input
                name="supplierCost"
                type="number"
                value={form.supplierCost}
                onChange={handleChange}
                required
                style={!form.supplierCost ? { borderColor: "#dc2626" } : {}}
              />
            </label>
            <label>
              Fees / adjustments
              <input
                name="feesAdjustments"
                type="number"
                value={form.feesAdjustments}
                onChange={handleChange}
              />
            </label>
            <label>
              First amount received
              <input
                name="totalReceived"
                type="number"
                value={form.totalReceived}
                onChange={handleChange}
              />
            </label>
            <label>
              Payment Method
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </label>
            {form.paymentMethod && (
              <label>
                {form.paymentMethod === "credit_card" ? "Credit Card Portal" : form.paymentMethod === "bank_transfer" ? "Bank Account" : form.paymentMethod === "upi" ? "UPI ID / Account" : form.paymentMethod === "cheque" ? "Cheque Number / Bank" : "Account / Details"}
                <input
                  name="paymentAccountOrPortal"
                  value={form.paymentAccountOrPortal}
                  onChange={handleChange}
                  placeholder={form.paymentMethod === "credit_card" ? "e.g., HDFC Credit Card, ICICI Credit Card" : form.paymentMethod === "bank_transfer" ? "e.g., HDFC Bank - Savings, SBI Current" : form.paymentMethod === "upi" ? "e.g., UPI ID or Account name" : form.paymentMethod === "cheque" ? "e.g., Cheque number and bank name" : "Enter account or details"}
                />
              </label>
            )}
            <div>
              <button type="submit">{editingId ? "Update booking" : "Save booking"}</button>
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
            <h2>Recent bookings</h2>
            <button onClick={loadBookings}>
              Refresh
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Type</th>
                <th>From/Check-in</th>
                <th>To/Check-out</th>
                <th>Travel date</th>
                <th>Sold</th>
                <th>Supplier cost</th>
                <th>Profit</th>
                <th>Remaining</th>
                {canViewAuditTrail() && <th>Created by</th>}
                {canViewAuditTrail() && <th>Updated by</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.customerId && b.customerId.name ? b.customerId.name : ""}</td>
                  <td>{b.type}</td>
                  <td>{b.type === "hotel" ? (b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : "") : b.from}</td>
                  <td>{b.type === "hotel" ? (b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : "") : b.to}</td>
                  <td>{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : ""}</td>
                  <td>{b.soldAt}</td>
                  <td>{b.supplierCost}</td>
                  <td>{b.profit}</td>
                  <td>{b.remainingBalance}</td>
                  {canViewAuditTrail() && (
                    <td style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {b.createdBy ? (b.createdBy.name || b.createdBy.username || "N/A") : "N/A"}
                    </td>
                  )}
                  {canViewAuditTrail() && (
                    <td style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {b.updatedBy ? (b.updatedBy.name || b.updatedBy.username || "N/A") : "N/A"}
                    </td>
                  )}
                  <td>
                    <button onClick={() => handleEdit(b)} style={{ marginRight: "0.5rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="btn-danger" style={{ marginRight: "0.5rem" }}>
                      Delete
                    </button>
                    <button onClick={() => handleViewPayments(b._id)}>
                      Payments
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={canViewAuditTrail() ? 12 : 10}>No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedBooking && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h2>Add payment for booking</h2>
          <form onSubmit={handlePaymentSubmit} className="form-grid">
            <label>
              Booking
              <select
                value={paymentForm.bookingId || selectedBooking}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, bookingId: e.target.value }))}
                required
              >
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
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))}
                required
              />
            </label>
            <label>
              Payment date
              <input
                type="date"
                value={paymentForm.date}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, date: e.target.value }))}
                onClick={(e) => e.target.showPicker?.()}
                style={{ cursor: "pointer" }}
              />
            </label>
            <label>
              Method
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, method: e.target.value }))}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Account / Company
              <input
                value={paymentForm.accountOrCompany}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, accountOrCompany: e.target.value }))}
              />
            </label>
            <button type="submit">Save payment</button>
          </form>
          {payments.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3>Payment history</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Account/Company</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td>{p.date ? new Date(p.date).toLocaleDateString() : ""}</td>
                      <td>{p.amount}</td>
                      <td>{p.method}</td>
                      <td>{p.accountOrCompany}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
