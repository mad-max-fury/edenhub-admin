import { AuthRouteConfig } from "@/constants/routes";
import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type Method,
} from "axios";
import Cookies from "js-cookie";

import { getPreloadedState } from "../getPreloadedState";
import type { IApiError } from "../api/genericInterface";
import { cookieValues } from "@/constants/data";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getPreloadedState().auth.access_token;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Clear the session and bounce to login (only once).
const clearSession = () => {
  Cookies.remove(cookieValues.token);
  Cookies.remove(cookieValues.refreshToken);
  Cookies.remove("persist:root");
  if (window.location.pathname !== AuthRouteConfig.LOGIN) {
    window.location.href = AuthRouteConfig.LOGIN;
  }
};

// Single-flight refresh: concurrent 401s share one refresh request instead of
// each firing their own (which would race and invalidate the refresh token).
let refreshPromise: Promise<string | null> | null = null;

const doRefresh = async (baseUrl: string): Promise<string | null> => {
  const refreshToken = getPreloadedState().auth.refresh_token;
  if (!refreshToken) return null;
  try {
    // Plain axios (not axiosInstance) so the auth interceptor / retry loop
    // doesn't apply to the refresh call itself.
    const res = await axios.post(
      baseUrl + "/auth/refresh-token",
      { refreshToken },
      { withCredentials: true },
    );
    const newToken: string | null = res.data?.data?.accessToken ?? null;
    if (newToken) Cookies.set(cookieValues.token, newToken);
    return newToken;
  } catch {
    return null;
  }
};

const refreshAccessToken = (baseUrl: string): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = doRefresh(baseUrl).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const axiosBaseQuery =
  ({
    baseUrl = "",
    baseHeaders = {},
  }: {
    baseUrl: string;
    baseHeaders?: AxiosRequestConfig["headers"];
  }): BaseQueryFn<
    {
      url: string;
      method: Method;
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      responseType?: AxiosRequestConfig["responseType"];
    },
    any,
    unknown
  > =>
  async ({ url, method, data, params, headers = {}, responseType }) => {
    const request = (authToken?: string) =>
      axiosInstance({
        url: baseUrl + url,
        method,
        params,
        data,
        headers: {
          ...baseHeaders,
          ...headers,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        responseType: responseType || "json",
        withCredentials: true,
      });

    try {
      const result = await request();
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const status = err.response?.status;
      const isAuthCall =
        url.includes("/auth/refresh-token") || url.includes("/auth/login");

      // 401 = token missing/expired/invalid → try a (deduped) refresh + retry.
      if (status === 401 && !isAuthCall) {
        const newToken = await refreshAccessToken(baseUrl);
        if (newToken) {
          try {
            const retry = await request(newToken);
            return { data: retry.data };
          } catch {
            // Retry still failed — fall through to clearing the session.
          }
        }
        clearSession();
        return {
          error: {
            status: 401,
            message: "Session expired. Please login again.",
          },
        };
      }

      // 403 = authenticated but not permitted. Do NOT refresh or log out —
      // surface it so the UI can show an access-denied message.
      return {
        error: {
          status: status ?? 500,
          message:
            (err.response?.data as IApiError)?.message ??
            err.message ??
            "Something went wrong",
          data: err.response?.data ?? null,
        },
      };
    }
  };
