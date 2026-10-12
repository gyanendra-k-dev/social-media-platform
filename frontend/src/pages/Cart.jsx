import { useEffect, useState } from "react";
import api, { errorText } from "../api";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () =>
    api.get("/cart").then((res) => setItems(res.data.items.filter((i) => i.product))).catch((e) => setMessage(errorText(e)));
  useEffect(() => { load(); }, []);

  const setQty = async (id, quantity) => {
    if (quantity < 1) return;
    try { await api.put(`/cart/${id}`, { quantity }); load(); } catch (e) { setMessage(errorText(e)); }
  };
  const remove = async (id) => {
    try { await api.delete(`/cart/${id}`); load(); } catch (e) { setMessage(errorText(e)); }
  };
  const checkout = async () => {
    try {
      await api.post("/orders");
      setMessage("Order placed. You can see it in My orders.");
      load();
    } catch (e) { setMessage(errorText(e)); }
  };

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">My cart</h1>
      {message && <p role="status" className="mb-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-dark">{message}</p>}
      {items.length === 0 ? (
        <p className="text-slate-500">Your cart is empty. Pick something from the shop.</p>
      ) : (
        <>
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {items.map((i) => (
              <li key={i.product._id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="mr-auto">
                  <p className="font-medium">{i.product.title}</p>
                  <p className="text-sm text-slate-500">₹{i.product.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost" onClick={() => setQty(i.product._id, i.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span className="w-6 text-center">{i.quantity}</span>
                  <button className="btn-ghost" onClick={() => setQty(i.product._id, i.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <p className="w-20 text-right font-semibold">₹{i.product.price * i.quantity}</p>
                <button className="btn-danger" onClick={() => remove(i.product._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-end gap-4">
            <p className="text-lg font-bold">Total: ₹{total}</p>
            <button className="btn-primary" onClick={checkout}>Place order</button>
          </div>
        </>
      )}
    </section>
  );
}
