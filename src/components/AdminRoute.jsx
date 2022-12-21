import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const { pathname } = useLocation();
  const isAdmin = useSelector((state) => state.auth.currentUser?.isAdmin);

  if (pathname === "/admin") return <Navigate to={"/not-found"} />;

  return isAdmin ? <Outlet /> : <Navigate to={"/"} />;
}

export default ProtectedRoute;
