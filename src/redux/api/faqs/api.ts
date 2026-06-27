import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IResponse } from "../genericInterface";
import type { ICreateFaq, IFaq } from "./interface";

const baseName = "/faqs";

export const faqsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<IResponse<IFaq[]>, void>({
      query: () => ({ url: baseName, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_FAQS }],
    }),

    createFaq: builder.mutation<IResponse<IFaq>, ICreateFaq>({
      query: (data) => ({ url: baseName, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_FAQS }],
    }),

    updateFaq: builder.mutation<
      IResponse<IFaq>,
      { id: string; data: Partial<ICreateFaq> }
    >({
      query: ({ id, data }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_FAQS }],
    }),

    deleteFaq: builder.mutation<IResponse<null>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: tagTypes.GET_FAQS }],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi;
