import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Seller from "./pages/Seller";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<ProtectedRoute roles={["buyer", "seller"]}><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={["buyer", "seller"]}><Orders /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute roles={["seller"]}><Seller /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />
          <Route
            path="*"
            element={<p>Page not found. <Link className="text-brand underline" to="/">Go to the shop</Link></p>}
          />
        </Routes>
      </main>
    </>
  );
}
