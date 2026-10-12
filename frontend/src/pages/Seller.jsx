import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import ProductCard from "../components/ProductCard";

const empty = { title: "", description: "", price: "", stock: "1", category: "" };

export default function Seller() {
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [mine, setMine] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/products/mine").then((r) => setMine(r.data)).catch((e) => setMessage(errorText(e)));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);
      await api.post("/products", data);
      setForm(empty);
      setImage(null);
      e.target.reset();
      setMessage("Product added.");
      load();
    } catch (err) {
      setMessage(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await api.delete(`/products/${id}`); load(); } catch (e) { setMessage(errorText(e)); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={submit} className="space-y-3 self-start rounded-lg border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-bold">Add a product</h1>
        <label className="block text-sm">Title<input className="input mt-1" required value={form.title} onChange={set("title")} /></label>
        <label className="block text-sm">Description<textarea className="input mt-1" rows="3" value={form.description} onChange={set("description")} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">Price (₹)<input className="input mt-1" type="number" min="0" required value={form.price} onChange={set("price")} /></label>
          <label className="block text-sm">Stock<input className="input mt-1" type="number" min="0" value={form.stock} onChange={set("stock")} /></label>
        </div>
        <label className="block text-sm">Category<input className="input mt-1" value={form.category} onChange={set("category")} /></label>
        <label className="block text-sm">Image (max 3 MB)
          <input className="mt-1 block w-full text-sm" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        {message && <p role="status" className="text-sm text-brand-dark">{message}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Uploading..." : "Add product"}</button>
      </form>

      <div>
        <h2 className="mb-4 text-xl font-bold">Your products</h2>
        {mine.length === 0 && <p className="text-slate-500">You have not added any products yet.</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          {mine.map((p) => (
            <ProductCard key={p._id} product={p} action={<button className="btn-danger w-full" onClick={() => remove(p._id)}>Delete</button>} />
          ))}
        </div>
      </div>
    </section>
  );
}
