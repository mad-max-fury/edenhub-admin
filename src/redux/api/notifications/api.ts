import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IResponse } from "../genericInterface";
import type { INotificationsResponse } from "./interface";

const baseName = "/notification";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      INotificationsResponse,
      { pageNumber?: number; pageSize?: number }
    >({
      query: (params) => ({ url: baseName, method: "GET", params }),
      providesTags: [{ type: tagTypes.GET_NOTIFICATIONS }],
    }),

    getUnreadCount: builder.query<IResponse<{ count: number }>, void>({
      query: () => ({ url: `${baseName}/unread-count`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_NOTIFICATION_COUNT }],
    }),

    markNotificationRead: builder.mutation<
      IResponse<{ count: number }>,
      { id: string }
    >({
      query: ({ id }) => ({ url: `${baseName}/${id}/read`, method: "PATCH" }),
      invalidatesTags: [
        { type: tagTypes.GET_NOTIFICATIONS },
        { type: tagTypes.GET_NOTIFICATION_COUNT },
      ],
    }),

    markAllNotificationsRead: builder.mutation<IResponse<{ count: number }>, void>(
      {
        query: () => ({ url: `${baseName}/read-all`, method: "PATCH" }),
        invalidatesTags: [
          { type: tagTypes.GET_NOTIFICATIONS },
          { type: tagTypes.GET_NOTIFICATION_COUNT },
        ],
      },
    ),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
