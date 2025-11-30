import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    role: "staff",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/users");
      setUsers(data);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      name: user.name || "",
      role: user.role || "staff",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ username: "", email: "", password: "", name: "", role: "staff" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await apiPut(`/api/users/${editingId}`, form);
        setEditingId(null);
      } else {
        await apiPost("/api/users", form);
      }
      setForm({ username: "", email: "", password: "", name: "", role: "staff" });
      await loadUsers();
    } catch (e) {
      setError("Failed to save user");
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Delete this user? This cannot be undone.")) {
      return;
    }
    setError("");
    try {
      await apiDelete(`/api/users/${userId}`);
      await loadUsers();
    } catch (e) {
      setError("Failed to delete user");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "#dc2626",
      manager: "#2563eb",
      accountant: "#059669",
      staff: "#6b7280",
    };
    return colors[role] || "#6b7280";
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>User Management</h1>
      </div>
      <div className="page-grid">
        <div className="card">
          <h2>{editingId ? "Edit user" : "Add user"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Username
              <input name="username" value={form.username} onChange={handleChange} required disabled={!!editingId} />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required disabled={!!editingId} />
            </label>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="staff">Staff</option>
                <option value="accountant">Accountant</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label>
              {editingId ? "New Password (leave empty to keep current)" : "Password"}
              <input type="password" name="password" value={form.password} onChange={handleChange} required={!editingId} />
            </label>
            <div>
              <button type="submit">{editingId ? "Update user" : "Create user"}</button>
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
            <h2>Users</h2>
            <button onClick={loadUsers} disabled={loading}>
              Refresh
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        background: getRoleColor(user.role),
                        color: "white",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{user.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => handleEdit(user)} style={{ marginRight: "0.5rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



