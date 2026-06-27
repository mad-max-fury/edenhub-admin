import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import type { IResponse } from "../genericInterface";
import type { IConversation, IConversationListResponse } from "./interface";

const baseName = "/conversations";

const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<
      IConversationListResponse,
      { pageSize?: number; pageNumber?: number; status?: string }
    >({
      query: (params) => ({
        url: baseName,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_CONVERSATIONS }],
    }),

    getConversation: builder.query<IResponse<IConversation>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_CONVERSATION }],
    }),

    adminReply: builder.mutation<
      IResponse<IConversation>,
      { id: string; body: string }
    >({
      query: ({ id, body }) => ({
        url: `${baseName}/${id}/reply`,
        method: "POST",
        data: { body },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CONVERSATIONS },
        { type: tagTypes.GET_CONVERSATION },
      ],
    }),

    closeConversation: builder.mutation<IResponse<IConversation>, string>({
      query: (id) => ({
        url: `${baseName}/${id}/close`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CONVERSATIONS },
        { type: tagTypes.GET_CONVERSATION },
      ],
    }),

    reopenConversation: builder.mutation<IResponse<IConversation>, string>({
      query: (id) => ({
        url: `${baseName}/${id}/reopen`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CONVERSATIONS },
        { type: tagTypes.GET_CONVERSATION },
      ],
    }),

    getAdminUnreadCount: builder.query<IResponse<{ count: number }>, void>({
      query: () => ({ url: `${baseName}/unread`, method: "GET" }),
    }),

    findOrCreateConversation: builder.query<IResponse<IConversation>, string>({
      query: (customerId) => ({
        url: `${baseName}/customer/${customerId}`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_CONVERSATION }],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAdminReplyMutation,
  useCloseConversationMutation,
  useReopenConversationMutation,
  useGetAdminUnreadCountQuery,
  useLazyFindOrCreateConversationQuery,
} = conversationApi;
