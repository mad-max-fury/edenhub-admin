import { specialChars } from "@/pages/auth/schema";
import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  role: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required("Please select a role"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/i, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      `Password must contain at least one special character (${specialChars})`,
    ),
});

export type AddUserFormData = yup.InferType<typeof addUserSchema>;

export const assignRoleSchema = yup.object().shape({
  role: yup
    .object()
    .shape({
      label: yup.string().required("Please select a role"),
      value: yup.string().required("Please select a role"),
    })
    .required("Please select a role"),
});
