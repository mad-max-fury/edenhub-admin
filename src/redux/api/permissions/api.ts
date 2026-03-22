import { baseApi } from "@/redux/baseApi";

import type { IResponse } from "../genericInterface";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import type { IPermission } from "./interface";

const baseName = "/permissions";

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionsUnpaginated: builder.query<IResponse<IPermission[]>, void>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_PERMISSIONS }],
    }),
  }),
});

export const { useGetPermissionsUnpaginatedQuery } = permissionsApi;
