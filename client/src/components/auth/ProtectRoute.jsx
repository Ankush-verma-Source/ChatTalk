import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectRoute({ children, redirect = "/login" }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // const isAuthenticated= true;
  return !isAuthenticated ? (
    <Navigate to={redirect} />
  ) : children ? (
    children
  ) : (
    <Outlet />
  );
}

export default ProtectRoute;
