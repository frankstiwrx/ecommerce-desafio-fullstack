import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import type { Product } from "../components/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGet<Product>(`/products/${id}`).then((prod) => {
      setP(prod);
      const stock = prod?.stock ?? 0;
      setQty((q) => Math.min(Math.max(1, q || 1), stock > 0 ? stock : 1));
    });
  }, [id]);

  useEffect(() => {
    if (!p) return;
    const stock = p.stock ?? 0;
    setQty((q) => Math.min(Math.max(1, q || 1), stock > 0 ? stock : 1));
  }, [p]);

  async function addToCart() {
    if (!p || p.stock <= 0) return;
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");

    try {
      setAdding(true);
      setMsg(null);
      await apiPost("/cart/items", { productId: p.id, qty }, true);
      setMsg("Item adicionado ao carrinho!");
    } catch (e: any) {
      const text = String(e?.message || "").toLowerCase();
      if (text.includes("insufficient") || text.includes("estoque")) {
        setMsg("Sem estoque suficiente.");
      } else {
        setMsg("Erro ao adicionar. Faça login e verifique o estoque.");
      }
    } finally {
      setAdding(false);
    }
  }

  if (!p) return <p>Carregando…</p>;

  const maxQty = p.stock ?? 0;
  const disabled = p.stock <= 0 || adding;

  return (
    <article className="product-detail">
      <img
        className="product-detail__image"
        src={p.imageUrl || "https://via.placeholder.com/600x400?text=No+image"}
        alt={p.name}
      />

      <div className="product-detail__info">
        <h1>{p.name}</h1>
        {p.description && <p>{p.description}</p>}

        <div className="price">R$ {p.price.toFixed(2)}</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
          Estoque: <strong>{p.stock}</strong>
        </div>

        <div
          className="qty-row"
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <label style={{ minWidth: 36 }}>Qtd:</label>
          <input
            type="number"
            className="input input--small"
            min={1}
            max={Math.max(1, maxQty)}
            value={qty}
            onChange={(e) => {
              const n = Number(e.target.value);
              const clamped = Math.min(
                Math.max(1, isNaN(n) ? 1 : n),
                Math.max(1, maxQty)
              );
              setQty(clamped);
            }}
            disabled={p.stock <= 0}
          />
        </div>

        <button
          className="btn btn--primary"
          disabled={disabled}
          onClick={addToCart}
          title={p.stock <= 0 ? "Sem estoque" : "Adicionar ao carrinho"}
        >
          {p.stock <= 0
            ? "Sem estoque"
            : adding
            ? "Adicionando..."
            : "Adicionar ao carrinho"}
        </button>

        {msg && (
          <p className="hint" style={{ marginTop: 10 }}>
            {msg}
          </p>
        )}
      </div>
    </article>
  );
}
