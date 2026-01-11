import { useNavigate } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";
import { baseApi } from "@/redux/baseApi";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

export default function useAuthAction() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = (callback?: () => void) => {
    const allCookies = Cookies.get();

    Object.keys(allCookies).forEach((key) => {
      Cookies.remove(key);
    });

    navigate(AuthRouteConfig.HOME, { replace: true });
    dispatch(baseApi.util.resetApiState());

    if (callback) {
      callback();
    }
  };

  return { logout };
}
