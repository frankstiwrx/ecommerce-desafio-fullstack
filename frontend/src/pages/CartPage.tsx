import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete, apiPost } from "../api";

type CartItem = {
  id: string;
  productId: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  product: { id: string; name: string; imageUrl?: string | null };
};

type Cart = { id: string; userId: string; items: CartItem[]; total: number };

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [errGlobal, setErrGlobal] = useState<string | null>(null);
  const [itemErrors, setItemErrors] = useState<Record<string, string | null>>(
    {}
  );

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErrGlobal(null);
      const data = await apiGet<Cart>("/cart", true);
      setCart(data);
    } catch (e: any) {
      setErrGlobal("Não foi possível carregar o carrinho. Faça login.");
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(itemId: string, qty: number) {
    if (qty < 1) return;
    try {
      const updated = await apiPatch<Cart>(
        `/cart/items/${itemId}`,
        { qty },
        true
      );
      setCart(updated);
      setItemErrors((prev) => ({ ...prev, [itemId]: null }));
    } catch (e: any) {
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: e?.message || "Estoque insuficiente.",
      }));
    }
  }

  async function removeItem(itemId: string) {
    try {
      const updated = await apiDelete<Cart>(`/cart/items/${itemId}`, true);
      setCart(updated);
      setItemErrors((prev) => ({ ...prev, [itemId]: null }));
    } catch (e: any) {
      setItemErrors((prev) => ({
        ...prev,
        [itemId]: e?.message || "Erro ao remover item.",
      }));
    }
  }

  async function checkout() {
    try {
      setCheckoutMsg(null);
      setCheckoutLoading(true);

      const order = await apiPost<{ id: string; total: number; items: any[] }>(
        "/orders/checkout",
        {},
        true
      );

      setCart((c) => (c ? { ...c, items: [], total: 0 } : c));
      setCheckoutMsg(`Pedido criado com sucesso! Nº: ${order.id}`);
    } catch (e: any) {
      console.error(e); // pra ver no console o que vem
      const status =
        e?.status ||
        (typeof e?.message === "string" && e.message.match(/\d+/)
          ? Number(e.message.match(/\d+/)[0])
          : null);

      if (status === 403) {
        setCheckoutMsg("Apenas usuários comuns podem finalizar compra.");
      } else if (status === 400) {
        setCheckoutMsg(
          e?.message || "Não foi possível finalizar: verifique o estoque."
        );
      } else if (status === 401) {
        setCheckoutMsg("Sessão expirada. Faça login novamente.");
      } else {
        setCheckoutMsg(e?.message || "Falha no checkout. Tente novamente.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Carregando carrinho…</p>;
  if (errGlobal && !cart) return <p className="error">{errGlobal}</p>;
  if (!cart || cart.items.length === 0)
    return (
      <section>
        <h1>Meu carrinho</h1>
        {checkoutMsg ? (
          <p className="hint">{checkoutMsg}</p>
        ) : (
          <p>Seu carrinho está vazio.</p>
        )}
      </section>
    );

  return (
    <section>
      <h1>Meu carrinho</h1>

      <div className="cart-list">
        {cart.items.map((it) => (
          <div key={it.id} className="cart-line">
            {it.product.imageUrl ? (
              <img src={it.product.imageUrl} alt={it.product.name} />
            ) : (
              <div className="thumb placeholder">Sem imagem</div>
            )}

            <div className="info">
              <p className="name">{it.product.name}</p>
              <p className="price">R$ {it.unitPrice.toFixed(2)}</p>

              <div className="qty-controls">
                <button
                  onClick={() => updateQty(it.id, it.qty - 1)}
                  disabled={it.qty <= 1}
                  title="Diminuir"
                >
                  –
                </button>
                <span>{it.qty}</span>
                <button
                  onClick={() => updateQty(it.id, it.qty + 1)}
                  title="Aumentar"
                >
                  +
                </button>
                <button
                  className="rm"
                  onClick={() => removeItem(it.id)}
                  title="Remover item"
                >
                  Remover
                </button>
              </div>

              {itemErrors[it.id] && (
                <p className="error" style={{ marginTop: 6 }}>
                  {itemErrors[it.id]}
                </p>
              )}
            </div>

            <div className="subtotal">R$ {it.subtotal.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div
        className="cart-total"
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        <h2 style={{ margin: 0 }}>Total: R$ {cart.total.toFixed(2)}</h2>
        <button
          className="btn btn--primary"
          onClick={checkout}
          disabled={checkoutLoading}
          title="Finalizar compra"
        >
          {checkoutLoading ? "Finalizando…" : "Finalizar compra"}
        </button>
      </div>

      {checkoutMsg && (
        <p
          className={checkoutMsg.startsWith("Pedido criado") ? "hint" : "error"}
          style={{ marginTop: 10 }}
        >
          {checkoutMsg}
        </p>
      )}
    </section>
  );
}
