import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api";

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

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "",
    companyLogo: "",
    contactNumber: "",
    email: "",
    gstin: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    stateCode: "",
    pincode: "",
    ownerName: "",
    ownerContact: "",
    ownerEmail: "",
    banks: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/settings");
      setSettings({
        ...data,
        banks: data.banks && data.banks.length > 0 ? data.banks : [{ bankName: "", bankAccountNumber: "", ifscCode: "", branchName: "", branchCity: "", swiftCode: "", accountType: "", upiId: "" }],
      });
    } catch (e) {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (index, field, value) => {
    setSettings((prev) => {
      const newBanks = [...prev.banks];
      newBanks[index] = { ...newBanks[index], [field]: value };
      return { ...prev, banks: newBanks };
    });
  };

  const handleAddBank = () => {
    if (settings.banks.length >= 3) {
      setError("Maximum 3 banks allowed");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      banks: [
        ...prev.banks,
        { bankName: "", bankAccountNumber: "", ifscCode: "", branchName: "", branchCity: "", swiftCode: "", accountType: "", upiId: "" },
      ],
    }));
  };

  const handleRemoveBank = (index) => {
    if (settings.banks.length <= 1) {
      setError("At least one bank is required");
      return;
    }
    setSettings((prev) => {
      const newBanks = prev.banks.filter((_, i) => i !== index);
      return { ...prev, banks: newBanks };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiPut("/api/settings", settings);
      setSuccess("Settings saved successfully");
      setIsEditing(false);
      await loadSettings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError("Failed to save settings");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadSettings();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
      <div className="card">
        <h2>Company Details</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Company Name
            <input
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Your company name"
              disabled={!isEditing}
            />
          </label>
          <label>
            Company Logo URL
            <input
              name="companyLogo"
              value={settings.companyLogo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              disabled={!isEditing}
            />
          </label>
          {settings.companyLogo && (
            <div style={{ gridColumn: "1 / -1" }}>
              <img
                src={settings.companyLogo}
                alt="Company logo"
                style={{ maxWidth: "200px", maxHeight: "100px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          <label>
            Contact Number
            <input
              name="contactNumber"
              value={settings.contactNumber}
              onChange={handleChange}
              placeholder="+91-XXXXXXXXXX"
              disabled={!isEditing}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="company@example.com"
              disabled={!isEditing}
            />
          </label>
          <label>
            GSTIN Number
            <input
              name="gstin"
              value={settings.gstin}
              onChange={handleChange}
              placeholder="15-character alphanumeric"
              pattern="[A-Z0-9]{15}"
              maxLength={15}
              style={{ textTransform: "uppercase" }}
              disabled={!isEditing}
            />
          </label>
          <label>
            PAN Number
            <input
              name="panNumber"
              value={settings.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              maxLength={10}
              style={{ textTransform: "uppercase" }}
              disabled={!isEditing}
            />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Address
            <textarea
              name="address"
              value={settings.address}
              onChange={handleChange}
              rows={3}
              placeholder="Street address"
              disabled={!isEditing}
            />
          </label>
          <label>
            City
            <input
              name="city"
              value={settings.city}
              onChange={handleChange}
              placeholder="City"
              disabled={!isEditing}
            />
          </label>
          <label>
            State (GST Code)
            <select
              name="stateCode"
              value={settings.stateCode}
              onChange={handleChange}
              style={{ minHeight: "150px", maxHeight: "200px" }}
              size={10}
              disabled={!isEditing}
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
            Pincode
            <input
              name="pincode"
              value={settings.pincode}
              onChange={handleChange}
              placeholder="PIN code"
              disabled={!isEditing}
            />
          </label>
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #e5e7eb", paddingTop: "1rem", marginTop: "1rem" }}>
            <h3>Owner Details</h3>
          </div>
          <label>
            Owner/Manager Name
            <input
              name="ownerName"
              value={settings.ownerName}
              onChange={handleChange}
              placeholder="Owner or Manager name"
              disabled={!isEditing}
            />
          </label>
          <label>
            Owner Contact Number
            <input
              name="ownerContact"
              value={settings.ownerContact}
              onChange={handleChange}
              placeholder="+91-XXXXXXXXXX"
              disabled={!isEditing}
            />
          </label>
          <label>
            Owner Email ID
            <input
              type="email"
              name="ownerEmail"
              value={settings.ownerEmail}
              onChange={handleChange}
              placeholder="owner@example.com"
              disabled={!isEditing}
            />
          </label>
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #e5e7eb", paddingTop: "1rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>Bank Details</h3>
              {isEditing && settings.banks.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddBank}
                  style={{ background: "#059669", fontSize: "1.2rem", padding: "0.25rem 0.75rem" }}
                >
                  +
                </button>
              )}
            </div>
            {settings.banks.map((bank, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                  background: "#f9fafb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0 }}>Bank {index + 1}</h4>
                  {isEditing && settings.banks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBank(index)}
                      className="btn-danger"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <label>
                    Bank Name
                    <input
                      value={bank.bankName || ""}
                      onChange={(e) => handleBankChange(index, "bankName", e.target.value)}
                      placeholder="Bank name"
                      disabled={!isEditing}
                    />
                  </label>
                  <label>
                    Account Number
                    <input
                      value={bank.bankAccountNumber || ""}
                      onChange={(e) => handleBankChange(index, "bankAccountNumber", e.target.value)}
                      placeholder="Account number"
                      disabled={!isEditing}
                    />
                  </label>
                  <label>
                    IFSC Code
                    <input
                      value={bank.ifscCode || ""}
                      onChange={(e) => handleBankChange(index, "ifscCode", e.target.value.toUpperCase())}
                      placeholder="IFSC code"
                      style={{ textTransform: "uppercase" }}
                      disabled={!isEditing}
                    />
                  </label>
                  <label>
                    Branch Name
                    <input
                      value={bank.branchName || ""}
                      onChange={(e) => handleBankChange(index, "branchName", e.target.value)}
                      placeholder="Branch name"
                      disabled={!isEditing}
                    />
                  </label>
                  <label>
                    Branch City
                    <input
                      value={bank.branchCity || ""}
                      onChange={(e) => handleBankChange(index, "branchCity", e.target.value)}
                      placeholder="Branch city"
                      disabled={!isEditing}
                    />
                  </label>
                  <label>
                    Swift Code
                    <input
                      value={bank.swiftCode || ""}
                      onChange={(e) => handleBankChange(index, "swiftCode", e.target.value.toUpperCase())}
                      placeholder="SWIFT code"
                      style={{ textTransform: "uppercase" }}
                      disabled={!isEditing}
                    />
                  </label>
                  <label>
                    Account Type
                    <select
                      value={bank.accountType || ""}
                      onChange={(e) => handleBankChange(index, "accountType", e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Select account type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </label>
                  <label>
                    UPI ID
                    <input
                      value={bank.upiId || ""}
                      onChange={(e) => handleBankChange(index, "upiId", e.target.value.toLowerCase())}
                      placeholder="yourname@upi"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
            <div>
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </button>
              <button type="button" onClick={handleCancel} style={{ marginLeft: "0.5rem" }}>
                Cancel
              </button>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          {success && <p style={{ color: "#059669" }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}
