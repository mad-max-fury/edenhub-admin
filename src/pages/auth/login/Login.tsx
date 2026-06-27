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
  const [verifyTwoFactor, { isLoading: isVerifying }] = useVerifyTwoFactorMutation();
  const [twoFA, setTwoFA] = useState<{ email: string; method: "email" | "authenticator" } | null>(null);
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
    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken }));
    Cookies.set(cookieValues.token, data.accessToken);
    Cookies.set(cookieValues.refreshToken, data.refreshToken);
    notify.success({ message: "Login successful!", subtitle: "Welcome back!" });
    navigate(AuthRouteConfig.DASHBOARD);
  };

  const onSubmit = async (formData: ISignInPayload) => {
    try {
      const response = await login({ email: formData.email, password: formData.password }).unwrap();

      if (response.data.twoFactorRequired) {
        setTwoFA({
          email: response.data.email ?? formData.email,
          method: response.data.twoFactorMethod || "email",
        });
        if (response.data.twoFactorMethod !== "authenticator") {
          notify.success({ message: "Verification required", subtitle: "We sent a code to your email" });
        }
        return;
      }

      finalizeLogin(response.data);
    } catch (error) {
      notify.error({ message: "Login failed", subtitle: getErrorMessage(error) });
    }
  };

  const onVerify = async () => {
    if (!twoFA || code.trim().length < 4) {
      notify.error({ message: "Enter the verification code" });
      return;
    }
    try {
      const response = await verifyTwoFactor({ email: twoFA.email, code: code.trim() }).unwrap();
      finalizeLogin(response.data);
    } catch (error) {
      notify.error({ message: "Verification failed", subtitle: getErrorMessage(error) });
    }
  };

  if (twoFA) {
    return (
      <AuthWrapper
        icon={<AppLogo />}
        title={twoFA.method === "authenticator" ? "Authenticator code" : "Check your email"}
        description={
          twoFA.method === "authenticator"
            ? "Enter the 6-digit code from your authenticator app."
            : `Enter the verification code we sent to ${twoFA.email}.`
        }
        hideAuthOptions
      >
        <div className="mt-5 flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-N700">
              {twoFA.method === "authenticator" ? "Authenticator code" : "Verification code"}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(twoFA.method === "authenticator" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value.slice(0, 8))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") onVerify(); }}
              className="w-full text-xl font-mono bg-transparent text-N700 placeholder:text-N80 border border-N40 rounded py-3 px-3 focus:outline-none focus:border-BR100 focus:border-2 tracking-[0.5em] text-center"
            />
          </div>
          <Button className="mt-3 flex w-full !items-center !justify-center font-bold" variant="brown-light" loading={isVerifying} onClick={onVerify}>
            Verify & sign in
          </Button>
          <button type="button" onClick={() => { setTwoFA(null); setCode(""); }} className="text-sm text-N500 hover:underline text-center">
            ← Back to login
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
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-5 w-full">
        <TextField inputType="input" name="email" type="email" placeholder="Enter email" label="Email Address"
          register={register} error={!!errors.email} errorText={errors.email && errors.email.message} />
        <TextField type="password" placeholder="Enter password" name="password" label="Password"
          register={register} error={!!errors.password} errorText={errors.password && errors.password.message} />

        <div className="flex items-center justify-between">
          <span></span>
          <Link to={AuthRouteConfig.FORGOT_PASSWORD}>
            <Typography className="hover:underline" color="BR400" fontWeight="medium">Forgot Password</Typography>
          </Link>
        </div>
        <Button className="mb-6 mt-3 flex w-full !items-center !justify-center !text-center font-bold" variant="brown-light" loading={isLoading} type="submit">
          Sign In
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
