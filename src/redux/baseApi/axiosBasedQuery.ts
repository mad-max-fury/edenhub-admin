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
  (error) => Promise.reject(error)
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
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (err.response?.status === 401) {
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((key) => {
          Cookies.remove(key);
        });

        window.location.href = AuthRouteConfig.LOGIN;
      }

      // if (err.response?.status === 403) {
      //   window.location.href = AuthRouteConfig.NO_ACCESS;
      // }

      return {
        error: {
          status: err.response?.status,
          error: err.message,
          ...(typeof err.response?.data === "object" ? err.response.data : {}),
        },
      };
    }
  };
