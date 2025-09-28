import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPatch } from "../api";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  stock: number;
  createdAt?: string;
};

type ListResp = {
  page: number;
  limit: number;
  total: number;
  items: Product[];
};

type FormState = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  stock: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  imageUrl: "",
  price: "",
  stock: "",
};

export default function AdminProducts() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSave = useMemo(() => {
    const price = Number(form.price);
    const stock = Number(form.stock);
    return (
      form.name.trim().length >= 2 &&
      !Number.isNaN(price) &&
      price >= 0 &&
      Number.isFinite(price) &&
      !Number.isNaN(stock) &&
      stock >= 0 &&
      Number.isInteger(stock)
    );
  }, [form]);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const qs = new URLSearchParams({
        q,
        page: String(page),
        limit: String(limit),
      }).toString();
      const resp = await apiGet<ListResp>(`/products?${qs}`);
      setData(resp);
    } catch (e: any) {
      setErr(e?.message || "Falha ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q, page, limit]);

  function startCreate() {
    setForm(emptyForm);
    setMsg(null);
  }

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      price: String(p.price),
      stock: String(p.stock),
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    try {
      setSaving(true);
      setMsg(null);

      const body = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (form.id) {
        await apiPatch(`/products/${form.id}`, body, true);
        setMsg("Produto atualizado com sucesso.");
      } else {
        await apiPost("/products", body, true);
        setMsg("Produto criado com sucesso.");
      }

      setForm(emptyForm);
      if (!form.id) setPage(1);
      await load();
    } catch (e: any) {
      setMsg(e?.message || "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1>Admin • Produtos</h1>

      {}
      <form
        onSubmit={save}
        style={{ margin: "16px 0", display: "grid", gap: 10, maxWidth: 680 }}
      >
        <h2 style={{ margin: "6px 0" }}>
          {form.id ? "Editar produto" : "Novo produto"}
        </h2>

        <div>
          <label>Nome</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ex: Camisa Barcelona 23/24"
          />
        </div>

        <div>
          <label>Descrição</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Opcional"
          />
        </div>

        <div>
          <label>Imagem (URL)</label>
          <input
            className="input"
            value={form.imageUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, imageUrl: e.target.value }))
            }
            placeholder="https://…"
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Preço (R$)</label>
            <input
              className="input"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="299.90"
            />
          </div>
          <div style={{ width: 160 }}>
            <label>Estoque</label>
            <input
              className="input"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
              placeholder="50"
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn--primary"
            type="submit"
            disabled={!canSave || saving}
          >
            {saving
              ? "Salvando…"
              : form.id
              ? "Salvar alterações"
              : "Criar produto"}
          </button>
          {form.id && (
            <button
              type="button"
              className="btn"
              onClick={startCreate}
              disabled={saving}
            >
              Cancelar edição
            </button>
          )}
        </div>

        {msg && <p className="hint">{msg}</p>}
      </form>

      {}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Buscar por nome…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <button className="btn" onClick={() => setPage(1)}>
          Buscar
        </button>
      </div>

      {loading && <p>Carregando…</p>}
      {err && <p className="error">{err}</p>}

      {!!data && (
        <>
          <p style={{ opacity: 0.85, marginTop: 6 }}>
            {data.total} resultado(s) • página {data.page}
          </p>

          <div className="grid">
            {data.items.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-card__image">
                  <img
                    src={
                      p.imageUrl ||
                      "https://via.placeholder.com/400x300?text=No+image"
                    }
                    alt={p.name}
                    loading="lazy"
                  />
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{p.name}</h3>
                  <div className="product-card__price">
                    R$ {p.price.toFixed(2)} • Estoque: {p.stock}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn--primary"
                      onClick={() => startEdit(p)}
                    >
                      Editar
                    </button>
                    {}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              className="btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ◀ Anterior
            </button>
            <button
              className="btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={data.items.length < limit}
            >
              Próxima ▶
            </button>
          </div>
        </>
      )}
    </section>
  );
}
