import AuthWrapper from "../AuthWrapper";
import { AppLogo, Button, TextField, notify } from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type ICreateNewPasswordFormData } from "../interfaces";
import { createNewPasswordSchema } from "../schema";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthRouteConfig } from "@/constants/routes";
import { useResetPasswordMutation } from "@/redux/api";
import { getErrorMessage } from "@/utils/getErrorMessges";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  // The :token route param carries the verification code from the OTP step.
  const { token } = useParams<{ token: string }>();
  const email = useLocation().state?.email as string | undefined;
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Reached without the email/code context — restart the flow.
  useEffect(() => {
    if (!email || !token) {
      navigate(AuthRouteConfig.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateNewPasswordFormData>({
    resolver: yupResolver(createNewPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ICreateNewPasswordFormData) => {
    if (!email || !token) return;
    try {
      await resetPassword({
        email,
        newPassword: data.password,
        verificationCode: token,
      }).unwrap();
      notify.success({
        message: "Password reset",
        subtitle: "You can now sign in with your new password",
      });
      navigate(AuthRouteConfig.LOGIN, { replace: true });
    } catch (error) {
      notify.error({
        message: "Could not reset password",
        subtitle: getErrorMessage(error),
      });
    }
  };

  return (
    <AuthWrapper
      icon={<AppLogo />}
      title="Create new password"
      description="Please choose a combination of at least 8 characters long and contains at least one letter, one number, and one special character."
      linkText="Go back to"
      linkSubText="Sign in"
      linkHref={AuthRouteConfig.LOGIN}
      hideAuthOptions
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5 w-full"
      >
        <TextField
          type="password"
          placeholder="Enter new password"
          name="password"
          label="New Password"
          register={register}
          error={!!errors.password}
          errorText={errors.password?.message}
        />
        <TextField
          type="password"
          placeholder="Re-enter new password"
          name="confirmPassword"
          label="Confirm New Password"
          register={register}
          error={!!errors.confirmPassword}
          errorText={errors.confirmPassword?.message}
        />
        <Button
          className="mt-8 w-full font-bold capitalize"
          variant="brown-light"
          type="submit"
          loading={isLoading}
        >
          reset password
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default CreateNewPassword;
