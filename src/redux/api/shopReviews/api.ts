import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IPaginationQuery } from "../interface";
import type {
  ICreateShopReview,
  IShopReview,
  IShopReviewStats,
} from "./interface";

const baseName = "/shop-reviews";

export const shopReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShopReview: builder.mutation<
      IResponse<IShopReview>,
      ICreateShopReview
    >({
      query: (data) => ({ url: `${baseName}/admin`, method: "POST", data }),
      invalidatesTags: [
        { type: tagTypes.GET_SHOP_REVIEWS },
        { type: tagTypes.GET_SHOP_REVIEW_STATS },
      ],
    }),

    getAllShopReviews: builder.query<
      IPaginatedResponse<IShopReview[]>,
      Partial<IPaginationQuery> & { status?: string }
    >({
      query: (params) => ({ url: `${baseName}/all`, method: "GET", params }),
      providesTags: [{ type: tagTypes.GET_SHOP_REVIEWS }],
    }),

    getShopReviewStats: builder.query<IResponse<IShopReviewStats>, void>({
      query: () => ({ url: `${baseName}/stats`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_SHOP_REVIEW_STATS }],
    }),

    updateShopReviewStatus: builder.mutation<
      IResponse<IShopReview>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `${baseName}/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_SHOP_REVIEWS },
        { type: tagTypes.GET_SHOP_REVIEW_STATS },
      ],
    }),

    deleteShopReview: builder.mutation<IResponse<null>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: tagTypes.GET_SHOP_REVIEWS },
        { type: tagTypes.GET_SHOP_REVIEW_STATS },
      ],
    }),
  }),
});

export const {
  useCreateShopReviewMutation,
  useGetAllShopReviewsQuery,
  useGetShopReviewStatsQuery,
  useUpdateShopReviewStatusMutation,
  useDeleteShopReviewMutation,
} = shopReviewsApi;
