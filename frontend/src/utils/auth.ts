export type JwtPayload = {
  sub: string;
  email: string;
  role?: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
};

export function getJwtPayload(): JwtPayload | null {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const base64 = t.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  return getJwtPayload()?.role === "ADMIN";
}
