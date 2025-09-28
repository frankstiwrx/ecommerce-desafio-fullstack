import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import type { Product } from "../components/ProductCard";
import { isAdmin } from "../utils/auth";

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const admin = isAdmin();

  useEffect(() => {
    if (!id) return;
    apiGet<Product>(`/products/${id}`).then(setP);
  }, [id]);

  async function addToCart() {
    if (admin) {
      setMsg("Administradores não usam carrinho. Somente visualização.");
      return;
    }
    try {
      setMsg(null);
      await apiPost("/cart/items", { productId: id, qty }, true);
      setMsg("Item adicionado ao carrinho!");
    } catch (e: any) {
      setMsg("Erro ao adicionar. Faça login e verifique o estoque.");
    }
  }

  if (!p) return <p>Carregando…</p>;

  const noStock = p.stock <= 0;

  return (
    <article className="product-detail">
      <img
        className="product-detail__image"
        src={p.imageUrl || "https://via.placeholder.com/600x400?text=No+image"}
        alt={p.name}
      />
      <div className="product-detail__info">
        <h1>{p.name}</h1>
        <p>{p.description}</p>

        <div className="price">R$ {p.price.toFixed(2)}</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
          Estoque: <strong>{p.stock}</strong>
        </div>

        <div className="qty-row">
          <label>Qtd:</label>
          <input
            type="number"
            min={1}
            max={p.stock}
            value={qty}
            onChange={(e) => {
              const n = Number(e.target.value);
              const clamped = Math.max(1, Math.min(p.stock, isNaN(n) ? 1 : n));
              setQty(clamped);
            }}
            className="input input--small"
            disabled={admin || noStock}
          />
        </div>

        <button
          className="btn btn--primary"
          disabled={admin || noStock}
          onClick={addToCart}
          title={
            admin
              ? "ADM: apenas visualização"
              : noStock
              ? "Sem estoque"
              : "Adicionar ao carrinho"
          }
        >
          {admin
            ? "Somente visualização"
            : noStock
            ? "Sem estoque"
            : "Adicionar ao carrinho"}
        </button>

        {msg && <p className="hint">{msg}</p>}
      </div>
    </article>
  );
}
