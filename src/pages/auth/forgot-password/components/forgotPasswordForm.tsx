"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, AppLogo, notify } from "@/components";
import { useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../../schema";
import type {
  IForgotPasswordFilterProps,
  IForgotPasswordPayload,
} from "../../interfaces";
import AuthWrapper from "../../AuthWrapper";
import { AuthRouteConfig } from "@/constants/routes";
import { useForgotPasswordMutation } from "@/redux/api";
import { getErrorMessage } from "@/utils/getErrorMessges";

interface IForgotPasswordFormProps {
  setFilter: React.Dispatch<React.SetStateAction<IForgotPasswordFilterProps>>;
}

export const ForgotPasswordForm = ({ setFilter }: IForgotPasswordFormProps) => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordPayload>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: IForgotPasswordPayload) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setFilter({ isSubmitted: true, email: data.email });
      notify.success({
        message: "Reset code sent",
        subtitle: "Check your email for the verification code",
      });
      navigate(AuthRouteConfig.VERIFY_OTP, { state: { email: data.email } });
    } catch (error) {
      notify.error({
        message: "Could not send reset code",
        subtitle: getErrorMessage(error),
      });
    }
  };

  return (
    <AuthWrapper
      icon={<AppLogo />}
      title="Forgot Password?"
      description="Enter your email address and we’ll send you a link to reset your password."
      linkText="Go back to"
      linkSubText="Sign in"
      linkHref={AuthRouteConfig.LOGIN}
      hideAuthOptions
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <TextField
          inputType="input"
          name="email"
          type="email"
          label="Email Address"
          placeholder="example@youremail.com"
          register={register}
          error={!!errors.email}
          errorText={errors.email?.message}
        />
        <Button
          type="submit"
          variant="brown-light"
          className="w-full capitalize"
          loading={isLoading}
        >
          send reset code
        </Button>
      </form>
    </AuthWrapper>
  );
};
