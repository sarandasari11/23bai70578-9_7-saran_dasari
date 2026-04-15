const STORAGE_KEYS = {
  username: "username",
  role: "role",
  authHeader: "authHeader",
};

export function normalizeRole(role) {
  if (!role) {
    return role;
  }

  return role.replace(/^ROLE_/, "");
}

export function saveSession({ username, role, authHeader }) {
  sessionStorage.setItem(STORAGE_KEYS.username, username);
  sessionStorage.setItem(STORAGE_KEYS.role, normalizeRole(role));
  sessionStorage.setItem(STORAGE_KEYS.authHeader, authHeader);
}

export function clearSession() {
  sessionStorage.clear();
}

export function getCurrentRole() {
  return sessionStorage.getItem(STORAGE_KEYS.role);
}

export function getCurrentUser() {
  return sessionStorage.getItem(STORAGE_KEYS.username);
}

export function getAuthHeader() {
  return sessionStorage.getItem(STORAGE_KEYS.authHeader);
}

export function isAuthenticated() {
  return Boolean(getCurrentUser() && getCurrentRole() && getAuthHeader());
}

export function canAccessUser() {
  const role = normalizeRole(getCurrentRole());
  return role === "USER" || role === "ADMIN";
}

export function canAccessAdmin() {
  return normalizeRole(getCurrentRole()) === "ADMIN";
}

export function buildBasicAuthHeader(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}