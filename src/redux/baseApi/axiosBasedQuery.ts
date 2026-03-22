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
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        params,
        data,
        headers: { ...baseHeaders, ...headers },
        responseType: responseType || "json",
        withCredentials: true,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response?.status === 403) {
        try {
          const refreshResponse = await axios.post(
            baseUrl + "/auth/refresh-token",
            { refreshToken: getPreloadedState().auth.refresh_token },
            { withCredentials: true },
          );

          const newAccessToken = refreshResponse.data.accessToken;

          const state = getPreloadedState();
          state.auth.access_token = newAccessToken;
          Cookies.set(cookieValues.token, newAccessToken);

          const retryResult = await axiosInstance({
            url: baseUrl + url,
            method,
            params,
            data,
            headers: {
              ...baseHeaders,
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
            withCredentials: true,
          });

          return { data: retryResult.data };
        } catch (refreshError) {
          Cookies.remove("persist:root");
          window.location.href = AuthRouteConfig.LOGIN;
          return {
            error: {
              status: 403,
              message: "Session expired. Please login again.",
            },
          };
        }
      }

      return {
        error: {
          status: err.response?.status ?? 500,
          message:
            (err.response?.data as IApiError)?.message ??
            err.message ??
            "Something went wrong",
          data: err.response?.data ?? null,
        },
      };
    }
  };
