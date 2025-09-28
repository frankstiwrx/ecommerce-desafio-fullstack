const KEY = "token";

export function getToken() {
  return localStorage.getItem(KEY);
}
export function setToken(t: string) {
  localStorage.setItem(KEY, t);
  window.dispatchEvent(new Event("auth-changed"));
}
export function clearToken() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth-changed"));
}
export function isLoggedIn() {
  return !!getToken();
}
