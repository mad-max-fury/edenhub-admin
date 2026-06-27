import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IPaginationQuery } from "../interface";
import type { IAd, ICreateAd } from "./interface";

const baseName = "/ads";

export const adsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAds: builder.query<IPaginatedResponse<IAd[]>, Partial<IPaginationQuery>>({
      query: (params) => ({ url: baseName, method: "GET", params }),
      providesTags: [{ type: tagTypes.GET_ADS }],
    }),

    getAd: builder.query<IResponse<IAd>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_AD }],
    }),

    createAd: builder.mutation<IResponse<IAd>, ICreateAd>({
      query: (data) => ({ url: baseName, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_ADS }],
    }),

    updateAd: builder.mutation<
      IResponse<IAd>,
      { id: string; data: Partial<ICreateAd> }
    >({
      query: ({ id, data }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_ADS }, { type: tagTypes.GET_AD }],
    }),

    deleteAd: builder.mutation<IResponse<null>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: tagTypes.GET_ADS }],
    }),
  }),
});

export const {
  useGetAdsQuery,
  useGetAdQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} = adsApi;
