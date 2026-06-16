import { baseApi } from "@/redux/baseApi";

import type { IResponse } from "../genericInterface";
import type { IOrder } from "../orders";
import type {
  AnalyticsRange,
  IAnalyticsSummary,
  ICategorySales,
  IProductAnalytics,
  ISalesPoint,
  ITopProduct,
} from "./interface";

const baseName = "/analytics";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query<
      IResponse<IAnalyticsSummary>,
      { range: AnalyticsRange }
    >({
      query: (params) => ({ url: `${baseName}/summary`, method: "GET", params }),
    }),

    getSalesTimeseries: builder.query<
      IResponse<ISalesPoint[]>,
      { range: AnalyticsRange }
    >({
      query: (params) => ({
        url: `${baseName}/sales-timeseries`,
        method: "GET",
        params,
      }),
    }),

    getTopProducts: builder.query<
      IResponse<ITopProduct[]>,
      { range: AnalyticsRange; limit?: number }
    >({
      query: (params) => ({
        url: `${baseName}/top-products`,
        method: "GET",
        params,
      }),
    }),

    getSalesByCategory: builder.query<
      IResponse<ICategorySales[]>,
      { range: AnalyticsRange }
    >({
      query: (params) => ({
        url: `${baseName}/sales-by-category`,
        method: "GET",
        params,
      }),
    }),

    getRecentOrders: builder.query<IResponse<IOrder[]>, { limit?: number }>({
      query: (params) => ({
        url: `${baseName}/recent-orders`,
        method: "GET",
        params,
      }),
    }),

    getProductAnalytics: builder.query<
      IResponse<IProductAnalytics>,
      { id: string; range: AnalyticsRange }
    >({
      query: ({ id, ...params }) => ({
        url: `${baseName}/product/${id}`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetSalesTimeseriesQuery,
  useGetTopProductsQuery,
  useGetSalesByCategoryQuery,
  useGetRecentOrdersQuery,
  useGetProductAnalyticsQuery,
} = analyticsApi;
