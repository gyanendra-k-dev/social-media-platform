import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `text-sm ${isActive ? "font-semibold text-brand" : "text-slate-600 hover:text-slate-900"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="mr-auto text-xl font-bold text-brand">Market</Link>
        <NavLink to="/" end className={linkClass}>Shop</NavLink>
        {user && user.role !== "admin" && <NavLink to="/cart" className={linkClass}>My cart</NavLink>}
        {user && user.role !== "admin" && <NavLink to="/orders" className={linkClass}>My orders</NavLink>}
        {user && user.role === "seller" && <NavLink to="/seller" className={linkClass}>Sell products</NavLink>}
        {user && user.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        {user ? (
          <>
            <span className="text-sm text-slate-500">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="btn-ghost">Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Log in</NavLink>
            <Link to="/signup" className="btn-primary">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
