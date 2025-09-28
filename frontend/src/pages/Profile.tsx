import { useEffect, useState } from "react";
import { apiGet } from "../api";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setErr(null);
        const me = await apiGet<User>("/users/me", true);
        setUser(me);
      } catch (e: any) {
        setErr("Faça login para ver o perfil.");
      }
    }
    load();
  }, []);

  if (err) return <p className="error">{err}</p>;
  if (!user) return <p>Carregando…</p>;

  const goAdmin = () => navigate("/admin");

  return (
    <section style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>Meu perfil</h1>
      <div style={{ marginTop: 12, lineHeight: 1.7 }}>
        <div>
          <strong>ID:</strong> {user.userId}
        </div>
        <div>
          <strong>E-mail:</strong> {user.email}
        </div>
        <div>
          <strong>Perfil:</strong> {user.role}
        </div>
      </div>

      {user.role === "ADMIN" && (
        <div style={{ marginTop: 20 }}>
          <button className="btn btn--primary" onClick={goAdmin}>
            Entrar no modo administrador
          </button>
          <p className="hint" style={{ marginTop: 8 }}>
            Gerenciar produtos.
          </p>
        </div>
      )}
    </section>
  );
}
