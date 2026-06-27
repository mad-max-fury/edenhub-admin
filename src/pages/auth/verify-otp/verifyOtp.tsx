import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthWrapper from "../AuthWrapper";
import OtpInput from "react-otp-input";
import {
  AppLogo,
  Button,
  notify,
  TextField,
  ValidationText,
} from "@/components";
import { verifyOtpSchema } from "../schema";
import { type IVerifyOtpPayload } from "../interfaces";
import { AuthRouteConfig } from "@/constants/routes";
import { useForgotPasswordMutation } from "@/redux/api";
import { getErrorMessage } from "@/utils/getErrorMessges";

const RESEND_INTERVAL = 60;

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const location = useLocation();
  const email = location.state?.email as string | undefined;

  // Without an email in route state there is nothing to reset — go back.
  useEffect(() => {
    if (!email) {
      navigate(AuthRouteConfig.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const [timer, setTimer] = useState(RESEND_INTERVAL);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleResend = useCallback(async () => {
    if (!email) return;
    try {
      await forgotPassword({ email }).unwrap();
      notify.success({ message: "A new code has been sent to your email" });
      setCanResend(false);
      setTimer(RESEND_INTERVAL);
    } catch (error) {
      notify.error({
        message: "Could not resend code",
        subtitle: getErrorMessage(error),
      });
    }
  }, [email, forgotPassword]);

  // The backend verifies the code at reset time, so carry the code forward to
  // the new-password step (via the :token route param) along with the email.
  const onSubmit = async (data: IVerifyOtpPayload) => {
    navigate(`/reset-password/${encodeURIComponent(data.otp)}`, {
      state: { email },
    });
  };

  return (
    <AuthWrapper
      icon={<AppLogo />}
      title="Enter verification code"
      description={`Enter the code we sent to ${email ?? "your email"} to reset your password.`}
      hideAuthOptions
      linkText="Go to"
      linkSubText="Sign in"
      linkHref={AuthRouteConfig.LOGIN}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 max-w-[450px] mx-auto space-y-6"
      >
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              numInputs={6}
              inputStyle={{
                width: "25%",
                height: "3.5rem",
                margin: "0 0.25rem",
              }}
              containerStyle="flex justify-start gap-2"
              shouldAutoFocus
              renderInput={(props) => (
                <TextField
                  {...props}
                  name=""
                  className="!w-full"
                  inputType="input"
                />
              )}
            />
          )}
        />
        {errors.otp && (
          <ValidationText
            message={errors.otp.message as string}
            status={"error"}
          />
        )}

        <div className="text-sm text-center text-N300">
          {canResend ? (
            <button
              type="button"
              className="text-BR400 font-medium hover:underline"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          ) : (
            <span>
              Resend available in <strong>{timer}s</strong>
            </span>
          )}
        </div>

        <Button variant="brown-light" type="submit" className="w-full">
          Verify
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default VerifyOtpPage;
