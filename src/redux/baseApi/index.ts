import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axiosBasedQuery";
import { tagTypes } from "./tagTypes";
import { apiUrl } from "@/config";

export const baseApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: apiUrl,
    baseHeaders: {
      "Content-Type": "application/json",
    },
  }),
  tagTypes: Object.values(tagTypes),
  endpoints: () => ({}),
});
