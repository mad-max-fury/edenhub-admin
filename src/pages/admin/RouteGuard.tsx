import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthRouteConfig } from "@/constants/routes";
import type { RootState } from "@/redux";

const ProtectedRouteLayout = () => {
  const location = useLocation();

  const { access_token } = useSelector((state: RootState) => state.auth);

  if (!access_token) {
    return (
      <Navigate to={AuthRouteConfig.LOGIN} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRouteLayout;
