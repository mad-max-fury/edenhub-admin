import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import type { IResponse } from "../genericInterface";
import type { IDispute } from "./interface";

const baseName = "/disputes";

const disputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisputes: builder.query<
      IResponse<{ data: IDispute[]; metadata: any }>,
      { pageSize?: number; pageNumber?: number; status?: string }
    >({
      query: (params) => ({ url: baseName, method: "GET", params }),
      providesTags: [{ type: tagTypes.GET_CONVERSATIONS }],
    }),

    getDispute: builder.query<IResponse<IDispute>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_CONVERSATION }],
    }),

    adminReplyDispute: builder.mutation<IResponse<IDispute>, { id: string; body: string; images?: string[] }>({
      query: ({ id, ...data }) => ({ url: `${baseName}/${id}/message`, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_CONVERSATION }],
    }),

    updateDisputeStatus: builder.mutation<IResponse<IDispute>, { id: string; status: string; resolution?: string }>({
      query: ({ id, ...data }) => ({ url: `${baseName}/${id}/status`, method: "PATCH", data }),
      invalidatesTags: [{ type: tagTypes.GET_CONVERSATIONS }, { type: tagTypes.GET_CONVERSATION }],
    }),

    refundDispute: builder.mutation<IResponse<IDispute>, { id: string; amount?: number }>({
      query: ({ id, ...data }) => ({ url: `${baseName}/${id}/refund`, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_CONVERSATIONS }, { type: tagTypes.GET_CONVERSATION }],
    }),
  }),
});

export const {
  useGetDisputesQuery,
  useGetDisputeQuery,
  useAdminReplyDisputeMutation,
  useUpdateDisputeStatusMutation,
  useRefundDisputeMutation,
} = disputeApi;
