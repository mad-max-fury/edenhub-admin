import { baseApi } from "@/redux/baseApi";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IPaginationQuery } from "../interface";
import type { ICreateRole, IRole, IUpdateRole } from "./interface";
const baseName = "/role";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<IResponse<IRole>, ICreateRole>({
      query: (data) => ({
        url: `${baseName}`,
        method: "POST",
        data,
      }),
    }),

    getRolesUnpaginated: builder.query<IResponse<IRole[]>, void>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
    }),
    getRoles: builder.query<IPaginatedResponse<IRole>, IPaginationQuery>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
    }),

    getRoleById: builder.query<IResponse<IRole>, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "GET",
      }),
    }),

    updateRoleById: builder.mutation<IResponse<IRole>, IUpdateRole>({
      query: ({ id, ...rest }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data: rest,
      }),
    }),

    deleteRoleById: builder.mutation<IResponse, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetRolesUnpaginatedQuery,
  useGetRoleByIdQuery,
  useUpdateRoleByIdMutation,
  useDeleteRoleByIdMutation,
} = roleApi;
