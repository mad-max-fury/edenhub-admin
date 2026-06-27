import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type {
  FulfillmentStatus,
  IOrder,
  IOrderListQuery,
  IOrderStats,
  IShipOrder,
  OrderStatus,
  PaymentStatus,
} from "./interface";

const baseName = "/order";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<IPaginatedResponse<IOrder[]>, IOrderListQuery>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_ORDERS }],
    }),

    getOrderStats: builder.query<IResponse<IOrderStats>, void>({
      query: () => ({ url: `${baseName}/stats`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_ORDER_STATS }],
    }),

    getOrderById: builder.query<IResponse<IOrder>, { id: string }>({
      query: ({ id }) => ({ url: `${baseName}/${id}`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_ORDER }],
    }),

    updateOrderStatus: builder.mutation<
      IResponse<IOrder>,
      { id: string; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `${baseName}/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    updateOrderPayment: builder.mutation<
      IResponse<IOrder>,
      { id: string; paymentStatus: PaymentStatus }
    >({
      query: ({ id, paymentStatus }) => ({
        url: `${baseName}/${id}/payment`,
        method: "PATCH",
        data: { paymentStatus },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    updateOrderFulfillment: builder.mutation<
      IResponse<IOrder>,
      { id: string; fulfillmentStatus: FulfillmentStatus }
    >({
      query: ({ id, fulfillmentStatus }) => ({
        url: `${baseName}/${id}/fulfillment`,
        method: "PATCH",
        data: { fulfillmentStatus },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    verifyOrderPayment: builder.mutation<IResponse<IOrder>, { id: string }>({
      query: ({ id }) => ({ url: `${baseName}/${id}/verify`, method: "POST" }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    refundOrder: builder.mutation<
      IResponse<IOrder>,
      { id: string; amount?: number }
    >({
      query: ({ id, amount }) => ({
        url: `${baseName}/${id}/refund`,
        method: "POST",
        data: { amount },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    shipOrder: builder.mutation<IResponse<IOrder>, IShipOrder>({
      query: ({ id, ...rest }) => ({
        url: `${baseName}/${id}/ship`,
        method: "POST",
        data: rest,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    trackOrder: builder.mutation<IResponse<{ order: IOrder; tracking: any }>, {
      id: string;
    }>({
      query: ({ id }) => ({ url: `${baseName}/${id}/track`, method: "POST" }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDERS },
      ],
    }),

    cancelOrder: builder.mutation<IResponse<IOrder>, { id: string }>({
      query: ({ id }) => ({ url: `${baseName}/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),

    reconcilePending: builder.mutation<
      IResponse<{
        checked: number;
        paid: number;
        cancelled: number;
        untouched: number;
      }>,
      void
    >({
      query: () => ({ url: `${baseName}/reconcile-pending`, method: "POST" }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_ORDER_STATS },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderPaymentMutation,
  useUpdateOrderFulfillmentMutation,
  useVerifyOrderPaymentMutation,
  useRefundOrderMutation,
  useShipOrderMutation,
  useTrackOrderMutation,
  useCancelOrderMutation,
  useReconcilePendingMutation,
} = orderApi;
