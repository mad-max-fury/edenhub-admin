import { baseApi } from "@/redux/baseApi";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IPaginationQuery } from "../interface";
import type { ICreateRole, IRole, IUpdateRole } from "./interface";
import { tagTypes } from "@/redux/baseApi/tagTypes";
const baseName = "/role";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<IResponse<IRole>, ICreateRole>({
      query: (data) => ({
        url: `${baseName}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ROLES },
        { type: tagTypes.GET_UNPAGINATED_ROLES },
      ],
    }),

    getRolesUnpaginated: builder.query<IResponse<IRole[]>, void>({
      query: (params) => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_UNPAGINATED_ROLES }],
    }),
    getRoles: builder.query<IPaginatedResponse<IRole[]>, IPaginationQuery>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_ROLES }],
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
      invalidatesTags: [
        { type: tagTypes.GET_ROLES },
        { type: tagTypes.GET_UNPAGINATED_ROLES },
      ],
    }),

    deleteRoleById: builder.mutation<IResponse, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ROLES },
        { type: tagTypes.GET_UNPAGINATED_ROLES },
      ],
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
