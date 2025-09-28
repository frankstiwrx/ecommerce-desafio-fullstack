import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost } from "../api";

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  stock: number;
};

export default function ProductCard({ p }: { p: Product }) {
  const nav = useNavigate();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [localStock, setLocalStock] = useState<number>(p.stock);
  const outOfStock = localStock <= 0;

  async function addOne() {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");

    try {
      setLoading(true);
      setMsg(null);
      await apiPost("/cart/items", { productId: p.id, qty: 1 }, true);
      setLocalStock((s) => Math.max(0, s - 1)); // decrementa e nunca passa de 0
      setMsg("Adicionado ao carrinho!");
      setTimeout(() => setMsg(null), 1200);
    } catch (err: any) {
      const text = String(err?.message || "").toLowerCase();
      if (text.includes("insufficient") || text.includes("estoque")) {
        setMsg("Sem estoque.");
        setLocalStock(0); // garante desabilitar
      } else {
        setMsg("Erro ao adicionar. Faça login e verifique o estoque.");
      }
      setTimeout(() => setMsg(null), 1800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-card">
      <Link to={`/product/${p.id}`} className="product-card__image">
        <img
          src={
            p.imageUrl || "https://via.placeholder.com/400x300?text=No+image"
          }
          alt={p.name}
          loading="lazy"
        />
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__title">{p.name}</h3>
        <div className="product-card__price">R$ {p.price.toFixed(2)}</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <Link className="btn btn--primary" to={`/product/${p.id}`}>
            Ver detalhes
          </Link>

          <button
            className="btn"
            onClick={addOne}
            disabled={loading || outOfStock}
            title={outOfStock ? "Sem estoque" : "Adicionar 1"}
          >
            {outOfStock
              ? "Sem estoque"
              : loading
              ? "Adicionando..."
              : "Adicionar"}
          </button>
        </div>

        <div style={{ fontSize: 13, opacity: 0.9 }}>
          Estoque: <strong>{localStock}</strong>
        </div>

        {msg && (
          <div className="hint" style={{ marginTop: 8 }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
