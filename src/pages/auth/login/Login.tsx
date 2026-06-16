import AuthWrapper from "../AuthWrapper";
import { AppLogo, Button, notify, TextField, Typography } from "@/components";
import { type ISignInPayload } from "../interfaces";
import { LoginSchema } from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";
import { useLoginMutation, useVerifyTwoFactorMutation } from "@/redux/api";
import { setCredentials } from "@/redux/api/auth/authSlice";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Cookies from "js-cookie";
import { cookieValues } from "@/constants/data";
import type { ILoginResData } from "@/redux/api/auth/interface";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [verifyTwoFactor, { isLoading: isVerifying }] =
    useVerifyTwoFactorMutation();
  const [twoFactorEmail, setTwoFactorEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInPayload>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const finalizeLogin = (data: ILoginResData) => {
    dispatch(
      setCredentials({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }),
    );
    Cookies.set(cookieValues.token, data.accessToken);
    Cookies.set(cookieValues.refreshToken, data.refreshToken);
    notify.success({ message: "Login successful!", subtitle: "Welcome back!" });
    navigate(AuthRouteConfig.DASHBOARD);
  };

  const onSubmit = async (formData: ISignInPayload) => {
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (response.data.twoFactorRequired) {
        setTwoFactorEmail(response.data.email ?? formData.email);
        notify.success({
          message: "Verification required",
          subtitle: "We sent a code to your email",
        });
        return;
      }

      finalizeLogin(response.data);
    } catch (error) {
      notify.error({
        message: "Login failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  const onVerify = async () => {
    if (!twoFactorEmail || code.trim().length < 4) {
      notify.error({ message: "Enter the code from your email" });
      return;
    }
    try {
      const response = await verifyTwoFactor({
        email: twoFactorEmail,
        code: code.trim(),
      }).unwrap();
      finalizeLogin(response.data);
    } catch (error) {
      notify.error({
        message: "Verification failed",
        subtitle: getErrorMessage(error),
      });
    }
  };
  if (twoFactorEmail) {
    return (
      <AuthWrapper
        icon={<AppLogo />}
        title="Two-factor verification"
        description={`Enter the 6-character code we sent to ${twoFactorEmail}.`}
        hideAuthOptions
      >
        <div className="mt-5 flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-N700">
              Verification code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full text-sm bg-transparent text-N700 placeholder:text-N80 border border-N40 rounded py-2.5 px-3 focus:outline-none focus:border-BR100 focus:border-2 tracking-widest"
            />
          </div>
          <Button
            className="mt-3 flex w-full !items-center !justify-center font-bold"
            variant={"brown-light"}
            loading={isVerifying}
            onClick={onVerify}
          >
            Verify & sign in
          </Button>
          <button
            type="button"
            onClick={() => {
              setTwoFactorEmail(null);
              setCode("");
            }}
            className="text-sm text-N500 hover:underline"
          >
            Back to login
          </button>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      icon={<AppLogo />}
      title="Welcome back!🖐️"
      description="Sign in back to your account by filling the form below with your personal information."
      hideAuthOptions
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5 w-full"
      >
        <TextField
          inputType="input"
          name="email"
          type="email"
          placeholder="Enter email"
          label="Email Address"
          register={register}
          error={!!errors.email}
          errorText={errors.email && errors.email.message}
        />
        <TextField
          type="password"
          placeholder="Enter password"
          name="password"
          label="Password"
          register={register}
          error={!!errors.password}
          errorText={errors.password && errors.password.message}
        />

        <div className="flex items-center justify-between">
          <span></span>
          <Link to={AuthRouteConfig.FORGOT_PASSWORD}>
            <Typography
              className="hover:underline"
              color={"BR400"}
              fontWeight={"medium"}
            >
              Forgot Password
            </Typography>
          </Link>
        </div>
        <Button
          className="mb-6 mt-3 flex w-full !items-center !justify-center !text-center font-bold"
          variant={"brown-light"}
          loading={isLoading}
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
