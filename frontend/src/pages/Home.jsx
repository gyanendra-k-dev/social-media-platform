import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = (q = "") => {
    setLoading(true);
    api
      .get("/products", { params: { search: q } })
      .then((res) => setProducts(res.data))
      .catch((err) => setMessage(errorText(err)))
      .finally(() => setLoading(false));
  };
  useEffect(() => load(), []);

  const addToCart = async (id) => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart", { productId: id, quantity: 1 });
      setMessage("Added to your cart.");
    } catch (err) {
      setMessage(errorText(err));
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">Shop</h1>
        <form
          onSubmit={(e) => { e.preventDefault(); load(search); }}
          className="flex gap-2"
        >
          <input className="input w-56" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-primary">Search</button>
        </form>
      </div>

      {message && <p role="status" className="mb-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-dark">{message}</p>}
      {loading && <p className="text-slate-500">Loading products...</p>}
      {!loading && products.length === 0 && (
        <p className="text-slate-500">No products yet. Sellers can add the first one from the Sell products page.</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            action={
              user?.role === "admin" ? null : (
                <button className="btn-primary w-full" disabled={p.stock < 1} onClick={() => addToCart(p._id)}>
                  Add to cart
                </button>
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
