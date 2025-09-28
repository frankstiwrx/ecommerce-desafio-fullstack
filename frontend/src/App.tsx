import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Homes";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminProducts from "./pages/AdminProducts";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminProducts />} /> {}
      </Routes>
    </Layout>
  );
}
