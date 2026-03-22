import { baseApi } from "@/redux/baseApi";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IPaginationQuery } from "../interface";
import type { IUpdateGroup, ICreateGroup, IGroup } from "./interface";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import type { IPermission } from "../permissions";

const baseName = "/group";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<IResponse<IGroup>, ICreateGroup>({
      query: (data) => ({
        url: `${baseName}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_GROUPS }],
    }),

    getGroupsUnpaginated: builder.query<IResponse<IGroup[]>, void>({
      query: (params) => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_GROUPS_UNPAGINATED }],
    }),

    getGroups: builder.query<IPaginatedResponse<IGroup[]>, IPaginationQuery>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_GROUPS }],
    }),

    getPermissionsByGroupId: builder.query<
      IPaginatedResponse<IPermission[]>,
      { id: string } & IPaginationQuery
    >({
      query: ({ id, ...params }) => ({
        url: `${baseName}/${id}/permissions`,
        method: "GET",
        params,
      }),

      providesTags: (result, error, { id }) => [
        { type: tagTypes.GET_GROUPS, id: `PERMISSIONS_${id}` },
      ],
    }),

    addPermissionsToGroup: builder.mutation<
      IResponse<IGroup>,
      { id: string; permissionsId: string[] }
    >({
      query: ({ id, permissionsId }) => ({
        url: `${baseName}/${id}/add-permission`,
        method: "PATCH",
        data: { permissionsId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.GET_GROUPS },
        { type: tagTypes.GET_GROUPS, id: `PERMISSIONS_${id}` },
      ],
    }),

    removePermissionFromGroup: builder.mutation<
      IResponse<IGroup>,
      { id: string; permissionId: string }
    >({
      query: ({ id, permissionId }) => ({
        url: `${baseName}/${id}/remove-permission`,
        method: "PATCH",
        data: { permissionId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.GET_GROUPS },
        { type: tagTypes.GET_GROUPS, id: `PERMISSIONS_${id}` },
      ],
    }),

    getGroupById: builder.query<IResponse<IGroup>, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "GET",
      }),
    }),

    updateGroupById: builder.mutation<IResponse<IGroup>, IUpdateGroup>({
      query: ({ id, ...rest }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data: rest,
      }),
      invalidatesTags: [{ type: tagTypes.GET_GROUPS }],
    }),

    deleteGroupById: builder.mutation<IResponse, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.GET_GROUPS }],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useGetGroupsUnpaginatedQuery,
  useGetGroupByIdQuery,
  useUpdateGroupByIdMutation,
  useDeleteGroupByIdMutation,
  useGetPermissionsByGroupIdQuery,
  useAddPermissionsToGroupMutation,
  useRemovePermissionFromGroupMutation,
} = roleApi;
