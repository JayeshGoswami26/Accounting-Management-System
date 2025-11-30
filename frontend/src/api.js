const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
    const err = new Error(error.message || `Request failed: ${res.status}`);
    err.response = res;
    err.errorData = error;
    throw err;
  }
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
    const err = new Error(error.message || `Request failed: ${res.status}`);
    err.response = res;
    err.errorData = error;
    throw err;
  }
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
    const err = new Error(error.message || `Request failed: ${res.status}`);
    err.response = res;
    err.errorData = error;
    throw err;
  }
  return res.json();
}



