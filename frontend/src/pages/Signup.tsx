import { useState } from "react";
import { apiPost } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      setLoading(true);
      await apiPost("/users", { name, email, password });
      setMsg("Conta criada! Verifique seu e-mail para confirmar.");
    } catch (e: any) {
      setErr(e?.message || "Falha ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ maxWidth: 460, margin: "30px auto" }}>
      <h1>Criar conta</h1>
      <form onSubmit={submit} className="form">
        <label>Nome</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />

        <label>E-mail</label>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />

        <label>Senha</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="mín. 6 caracteres"
        />

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Criar conta"}
        </button>

        {msg && (
          <p className="hint" style={{ marginTop: 8 }}>
            {msg}
          </p>
        )}
        {err && (
          <p className="error" style={{ marginTop: 8 }}>
            {err}
          </p>
        )}
      </form>

      <p style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>

      {msg && (
        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={() => navigate("/login")}>
            Ir para login
          </button>
        </div>
      )}
    </section>
  );
}
