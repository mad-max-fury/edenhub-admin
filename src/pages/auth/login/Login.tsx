import AuthWrapper from "../AuthWrapper";
import { AppLogo, Button, TextField, Typography } from "@/components";
import { type ISignInPayload } from "../interfaces";
import { LoginSchema } from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInPayload>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = (formData: ISignInPayload) => {
    console.log("formData", formData);
    navigate(AuthRouteConfig.DASHBOARD);
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
          loading={false}
        >
          Sign In
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
