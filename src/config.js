// Funciones de utilidad para acceder a la API y a los datos del usuario guardados en localStorage.
// Centralizar la URL aquí facilita cambiarla cuando se pase a producción.
export function getApi() {
  return "http://localhost:8000/api";
}

// El token JWT se guarda en localStorage al hacer login y se elimina al hacer logout.
export function getToken() {
  return localStorage.getItem("token");
}

// El objeto usuario completo se guarda en localStorage para no tener que llamar a la API en cada render.
// Se actualiza cuando el usuario edita su perfil o cambia su tipo de cuenta.
export function getUser() {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
}

// Construye las cabeceras HTTP necesarias para llamadas autenticadas a la API.
// contentType es opcional: solo se incluye cuando se envía un body JSON (POST/PUT).
export function getAuthHeaders(contentType = null) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}
