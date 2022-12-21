import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ShoppingCart from "./pages/ShoppingCart";
import Orders from "./pages/Orders";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import MyOrdersDetails from "./pages/MyOrderDetails";
import ProductForm from "./pages/ProductForm";
import CategoryForm from "./pages/CategoryForm";
import ProductsTable from "./pages/ProductsTable";
import CategoriesTable from "./pages/CategoriesTable";
import ProductDetail from "./pages/ProductDetail";
import Users from "./pages/Users";
import Category from "./pages/Category";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <ToastContainer className="toastify" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders/:id" element={<MyOrdersDetails />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/category/:name" element={<Category />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="products" element={<ProductsTable />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="categories" element={<CategoriesTable />} />
          <Route path="categories/:id" element={<CategoryForm />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
