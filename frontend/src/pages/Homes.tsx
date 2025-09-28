import { useEffect, useState } from "react";
import { apiGet } from "../api";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
type ProductsResponse = {
  page: number;
  limit: number;
  total: number;
  items: Product[];
};

export default function Home() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const resp = await apiGet<ProductsResponse>(
        `/products?q=${encodeURIComponent(q)}`
      );
      setData(resp);
    } catch (e: any) {
      setErr(e.message ?? "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <section>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Buscar produtos…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <p>Carregando…</p>}
      {err && <p className="error">Erro: {err}</p>}

      {!!data && (
        <div className="grid">
          {data.items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
