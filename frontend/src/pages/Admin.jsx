import { useEffect, useState } from "react";
import api, { errorText } from "../api";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [s, u, o, p] = await Promise.all([
        api.get("/admin/stats"), api.get("/admin/users"), api.get("/admin/orders"), api.get("/products"),
      ]);
      setStats(s.data); setUsers(u.data); setOrders(o.data); setProducts(p.data);
    } catch (e) { setMessage(errorText(e)); }
  };
  useEffect(() => { load(); }, []);

  const run = async (fn) => { try { await fn(); load(); } catch (e) { setMessage(errorText(e)); } };

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      {message && <p role="alert" className="text-red-700">{message}</p>}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-3xl font-bold text-brand">{v}</p>
              <p className="text-sm capitalize text-slate-500">{k}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-2 text-lg font-semibold">Users</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2"></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-200">
                  <td className="p-2">{u.name}</td><td className="p-2">{u.email}</td><td className="p-2">{u.role}</td>
                  <td className="p-2 text-right">
                    {u.role !== "admin" && <button className="btn-danger" onClick={() => confirm("Delete this user?") && run(() => api.delete(`/admin/users/${u._id}`))}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">All products</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2">Title</th><th className="p-2">Price</th><th className="p-2">Seller</th><th className="p-2"></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-slate-200">
                  <td className="p-2">{p.title}</td><td className="p-2">₹{p.price}</td><td className="p-2">{p.seller?.name}</td>
                  <td className="p-2 text-right"><button className="btn-danger" onClick={() => confirm("Delete this product?") && run(() => api.delete(`/products/${p._id}`))}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Orders</h2>
        {orders.length === 0 && <p className="text-slate-500">No orders yet.</p>}
        <div className="space-y-3">
          {orders.map((o) => (
            <article key={o._id} className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm">
              <div className="mr-auto">
                <p className="font-medium">{o.user?.name} ({o.user?.email})</p>
                <p className="text-slate-500">{o.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}</p>
              </div>
              <p className="font-bold">₹{o.total}</p>
              <select className="input w-auto" value={o.status} onChange={(e) => run(() => api.put(`/admin/orders/${o._id}`, { status: e.target.value }))}>
                {["placed", "shipped", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
