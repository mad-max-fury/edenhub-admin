import { cookieValues } from "@/constants/data";
import Cookies from "js-cookie";

export const getPreloadedState = () => {
  const token = Cookies.get(cookieValues.token);

  const defaultValue = {
    auth: {
      access_token: token ?? null,
    },
  };

  return defaultValue;
};
