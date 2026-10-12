import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorText } from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold">Create your account</h1>
      {error && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <label className="block text-sm">Name
        <input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="block text-sm">Email
        <input className="input mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block text-sm">Password (at least 6 characters)
        <input className="input mt-1" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      <label className="block text-sm">I want to
        <select className="input mt-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="buyer">Buy products</option>
          <option value="seller">Sell products</option>
        </select>
      </label>
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Creating..." : "Sign up"}</button>
      <p className="text-sm text-slate-600">Already have an account? <Link className="text-brand underline" to="/login">Log in</Link></p>
    </form>
  );
}
