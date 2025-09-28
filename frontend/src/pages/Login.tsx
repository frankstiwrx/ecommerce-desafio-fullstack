import { useState } from "react";
import { apiPost } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("novo@example.com");
  const [password, setPassword] = useState("senha123");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const payload = {
      email: email.trim(),
      password,
    };

    try {
      setLoading(true);

      // limpa qualquer token antigo
      localStorage.removeItem("token");

      const data = await apiPost<{ accessToken: string }>(
        "/auth/login",
        payload
      );

      localStorage.setItem("token", data.accessToken);
      // avisa o header/Layout para atualizar o estado de auth
      window.dispatchEvent(new Event("auth-changed"));

      navigate("/");
    } catch (err: any) {
      // o api.ts lança Error com o texto da resposta; vamos tentar qualificar
      const text = String(err?.message ?? "").toLowerCase();

      if (text.includes("email not verified")) {
        setMsg(
          "Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada."
        );
      } else if (
        text.includes("invalid email or password") ||
        text.includes("401")
      ) {
        setMsg("Credenciais inválidas. Confira e-mail e senha.");
      } else if (text.includes("400")) {
        setMsg("Falha ao autenticar. Verifique seus dados.");
      } else {
        setMsg("Erro inesperado ao entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ maxWidth: 420, margin: "30px auto" }}>
      <h1>Login</h1>

      <form onSubmit={submit} className="form">
        <label>E-mail</label>
        <input
          className="input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <label>Senha</label>
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg && (
          <p className="error" style={{ marginTop: 8 }}>
            {msg}
          </p>
        )}

        <p style={{ marginTop: 12 }}>
          Não possui conta? <Link to="/signup">Criar conta</Link>
        </p>
      </form>
    </section>
  );
}
