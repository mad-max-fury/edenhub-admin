import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthRouteConfig } from "@/constants/routes";
import type { RootState } from "@/redux";

const PublicRouteLayout = () => {
  // const { access_token } = useSelector((state: RootState) => state.auth);

  // if (access_token) {
  //   return <Navigate to={AuthRouteConfig.DASHBOARD} replace />;
  // }

  return <Outlet />;
};

export default PublicRouteLayout;
