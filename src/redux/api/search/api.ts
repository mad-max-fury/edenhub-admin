import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "../genericInterface";
import type { IGlobalSearchData } from "./interface";

const baseName = "/search";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<IResponse<IGlobalSearchData>, string>({
      query: (q) => ({ url: baseName, method: "GET", params: { q } }),
    }),
  }),
});

export const { useGlobalSearchQuery } = searchApi;
