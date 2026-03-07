import { baseApi } from "@/redux/baseApi";
import type { IOnboardUser, IUpdatedUser, IUpdateUser } from "./interface";
import type { IResponse } from "../genericInterface";
import type { IUser } from "../auth";
const baseName = "/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onboardUser: builder.mutation<IResponse<IUpdatedUser>, IOnboardUser>({
      query: (data) => ({
        url: `${baseName}/onboard`,
        method: "POST",
        data,
      }),
    }),

    getUsers: builder.query<IResponse<Array<IUser>>, void>({
      query: () => ({
        url: `${baseName}`,
        method: "GET",
      }),
    }),

    getUserById: builder.query<IResponse<IUser>, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "GET",
      }),
    }),
    updateUserById: builder.mutation<IResponse<IUpdatedUser>, IUpdateUser>({
      query: ({ id, user }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data: user,
      }),
    }),

    deleteUserById: builder.mutation<IResponse, { id: string }>({
      query: (params) => ({
        url: `${baseName}/${params.id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useOnboardUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApi;
