import AuthWrapper from "../AuthWrapper";
import { AppLogo, Button, TextField } from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type ICreateNewPasswordFormData } from "../interfaces";
import { createNewPasswordSchema } from "../schema";
import { useNavigate } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateNewPasswordFormData>({
    resolver: yupResolver(createNewPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ICreateNewPasswordFormData) => {
    console.log("New password data:", data);
    navigate(AuthRouteConfig.VERIFY_OTP, {
      state: { email: "chrisnonso8@gmail.com" },
    });
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
          loading={false}
        >
          reset password
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default CreateNewPassword;
