import { useState } from "react";
import { ForgotPasswordConfirmation, ForgotPasswordForm } from "./components";
import { type IForgotPasswordFilterProps } from "../interfaces";

const ForgotPasswordPage = () => {
  const [filter, setFilter] = useState<IForgotPasswordFilterProps>({
    isSubmitted: false,
    email: "",
  });

  return (
    <>
      {!filter.isSubmitted ? (
        <ForgotPasswordForm setFilter={setFilter} />
      ) : (
        <ForgotPasswordConfirmation filter={filter} />
      )}
    </>
  );
};

export default ForgotPasswordPage;
