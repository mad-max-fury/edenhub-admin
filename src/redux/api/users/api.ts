import { baseApi } from "@/redux/baseApi";
import type { IOnboardUser, IUpdatedUser, IUpdateUser } from "./interface";
import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IUser } from "../auth";
import type { IPaginationQuery } from "../interface";
import { tagTypes } from "@/redux/baseApi/tagTypes";
const baseName = "/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onboardUser: builder.mutation<IResponse<IUpdatedUser>, IOnboardUser>({
      query: (data) => ({
        url: `${baseName}/onboard`,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_STAFFS },
        { type: tagTypes.GET_CUSTOMERS },
      ],
    }),

    getCustomers: builder.query<IPaginatedResponse<IUser[]>, IPaginationQuery>({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_CUSTOMERS }],
    }),

    getStaffs: builder.query<
      IPaginatedResponse<IUser[]>,
      IPaginationQuery & {
        roleId?: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/staffs`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_STAFFS }],
    }),

    getUserById: builder.query<IResponse<IUser>, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_USER }],
    }),
    updateUserById: builder.mutation<IResponse<IUpdatedUser>, IUpdateUser>({
      query: ({ id, user }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data: user,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_STAFFS },
        { type: tagTypes.GET_CUSTOMERS },
      ],
    }),

    deleteUserById: builder.mutation<IResponse, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_STAFFS },
        { type: tagTypes.GET_CUSTOMERS },
      ],
    }),
  }),
});

export const {
  useOnboardUserMutation,
  useGetCustomersQuery,
  useGetStaffsQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApi;
