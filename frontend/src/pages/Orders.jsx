import { useEffect, useState } from "react";
import api, { errorText } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders/mine").then((r) => setOrders(r.data)).catch((e) => setError(errorText(e)));
  }, []);

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">My orders</h1>
      {error && <p role="alert" className="mb-3 text-red-700">{error}</p>}
      {orders.length === 0 && !error && <p className="text-slate-500">You have not placed any orders yet.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o._id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex justify-between text-sm text-slate-500">
              <span>{new Date(o.createdAt).toLocaleString()}</span>
              <span className="font-medium capitalize text-brand">{o.status}</span>
            </div>
            <ul className="my-2 text-sm">
              {o.items.map((i, idx) => (<li key={idx}>{i.title} × {i.quantity} — ₹{i.price * i.quantity}</li>))}
            </ul>
            <p className="font-bold">Total: ₹{o.total}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
