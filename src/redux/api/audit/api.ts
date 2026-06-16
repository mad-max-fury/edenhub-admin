import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IPaginatedResponse } from "../genericInterface";
import type { IAuditListQuery, IAuditLog } from "./interface";

const baseName = "/audit";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAudits: builder.query<IPaginatedResponse<IAuditLog[]>, IAuditListQuery>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_AUDITS }],
    }),
  }),
});

export const { useGetAuditsQuery } = auditApi;
