import { baseApi } from "@/redux/baseApi";
import type {
  ILoginInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IVerifyGoogleCodeInput,
  ILoginResData,
  IVerify2FAInput,
} from "./interface";
import type { IResponse } from "../genericInterface";

const baseName = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IResponse<ILoginResData>, ILoginInput>({
      query: (data) => ({
        url: `${baseName}/login`,
        method: "POST",
        data,
      }),
    }),

    verifyTwoFactor: builder.mutation<IResponse<ILoginResData>, IVerify2FAInput>({
      query: (data) => ({
        url: `${baseName}/2fa/verify`,
        method: "POST",
        data,
      }),
    }),

    forgotPassword: builder.mutation<any, IForgotPasswordInput>({
      query: (data) => ({
        url: `${baseName}/forgot-password`,
        method: "POST",
        data,
      }),
    }),

    resetPassword: builder.mutation<any, IResetPasswordInput>({
      query: (data) => ({
        url: `${baseName}/reset-password`,
        method: "PATCH",
        data,
      }),
    }),

    verifyGoogleCode: builder.mutation<any, IVerifyGoogleCodeInput>({
      query: (data) => ({
        url: `${baseName}/google/verify`,
        method: "POST",
        data,
      }),
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: `${baseName}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyTwoFactorMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyGoogleCodeMutation,
  useLogoutMutation,
} = authApi;
