import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { apiGet } from "../api";
import type { User } from "../types";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("auth-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("auth-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const me = await apiGet<User>("/users/me", true);
        setUser(me);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    fetchMe();
  }, [token]);

  function logout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  }

  const isAdmin = user?.role === "ADMIN";
  const cartLink = isAdmin ? "/profile" : "/cart"; // <- redireciona admin pro perfil

  const displayName =
    (user?.email?.split("@")[0] ?? "Usuário").slice(0, 18) +
    (isAdmin ? " (admin)" : "");

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand" style={{ fontSize: "1.6rem" }}>
            Minha Loja
          </Link>

          <nav className="nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Produtos
            </NavLink>

            <NavLink
              to={cartLink}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Carrinho
            </NavLink>

            {!token ? (
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Login
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                  title="Meu perfil"
                >
                  {displayName}
                </NavLink>
                <button className="btn btn--link" onClick={logout}>
                  Sair
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">{children}</main>

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} Minha Loja — Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}
