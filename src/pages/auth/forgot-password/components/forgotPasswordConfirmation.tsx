import { Button } from "@/components";
import AuthWrapper from "../../AuthWrapper";
import { MessageNotifIcon } from "@/assets/svgs";
import { type IForgotPasswordFilterProps } from "../../interfaces";
import { AuthRouteConfig } from "@/constants/routes";

interface IForgotPasswordConfirmationProps {
  filter?: IForgotPasswordFilterProps;
}

export const ForgotPasswordConfirmation = ({
  filter,
}: IForgotPasswordConfirmationProps) => {
  return (
    <AuthWrapper
      icon={<MessageNotifIcon className="size-[106px] mb-4" />}
      title="Email is on the way"
      description={`We sent a confirmation link to ${filter?.email}. If you don’t see it, check your spam folder or resend the email`}
      linkText="Go to"
      linkSubText="Sign in"
      linkHref={AuthRouteConfig.LOGIN}
      hideAuthOptions
    >
      <Button variant="brown-light" className="w-full capitalize">
        resend email
      </Button>
    </AuthWrapper>
  );
};
