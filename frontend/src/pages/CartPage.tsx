import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete } from "../api";

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

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Carregando carrinho…</p>;
  if (errGlobal && !cart) return <p className="error">{errGlobal}</p>;
  if (!cart || cart.items.length === 0) return <p>Seu carrinho está vazio.</p>;

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

              {/* mensagem específica do item */}
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

      <div className="cart-total">
        <h2>Total: R$ {cart.total.toFixed(2)}</h2>
      </div>
    </section>
  );
}
