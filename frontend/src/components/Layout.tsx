import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

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
              to="/cart"
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
              <button className="btn btn--link" onClick={logout}>
                Sair
              </button>
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
