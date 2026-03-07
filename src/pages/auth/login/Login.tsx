import AuthWrapper from "../AuthWrapper";
import { AppLogo, Button, notify, TextField, Typography } from "@/components";
import { type ISignInPayload } from "../interfaces";
import { LoginSchema } from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";
import { useLoginMutation } from "@/redux/api";
import { setCredentials } from "@/redux/api/auth/authSlice";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { cookieValues } from "@/constants/data";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInPayload>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: ISignInPayload) => {
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      console.log(response);

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }),
      );

      Cookies.set(cookieValues.token, response.data.accessToken);
      Cookies.set(cookieValues.refreshToken, response.data.refreshToken);

      notify.success({
        message: "Login successful!",
        subtitle: "Welcome back!",
      });

      navigate(AuthRouteConfig.DASHBOARD);
    } catch (error) {
      notify.error({
        message: "Login failed",
        subtitle: getErrorMessage(error),
      });
    }
  };
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
