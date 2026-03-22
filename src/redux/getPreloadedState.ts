import { cookieValues } from "@/constants/data";
import Cookies from "js-cookie";

export const getPreloadedState = () => {
  const token = Cookies.get(cookieValues.token);
  const refreshToken = Cookies.get(cookieValues.refreshToken);

  const defaultValue = {
    auth: {
      access_token: token ?? null,
      refresh_token: refreshToken ?? null,
    },
  };

  return defaultValue;
};
