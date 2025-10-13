// frontend/src/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // tenta extrair uma mensagem amigável…
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message)
        msg = Array.isArray(data.message) ? data.message[0] : data.message;
    } catch {
      try {
        msg = await res.text();
      } catch {}
    }
    // …mas **sempre** mantém o status para o chamador usar
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

function getAuthHeaders(auth: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (auth) {
    const t = localStorage.getItem("token");
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  return headers;
}

// (as demais funções ficam iguais)
export async function apiGet<T>(path: string, auth = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getAuthHeaders(auth),
  });
  return handleResponse<T>(res);
}
export async function apiPost<T>(
  path: string,
  body: any,
  auth = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders(auth) },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
export async function apiPatch<T>(
  path: string,
  body: any,
  auth = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders(auth) },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
export async function apiDelete<T>(path: string, auth = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(auth),
  });
  return handleResponse<T>(res);
}
