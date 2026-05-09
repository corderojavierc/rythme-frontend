export function getApi() {
  return "http://localhost:8000/api";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getAuthHeaders(contentType = null) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}
