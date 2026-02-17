import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  staffId: yup.string().required("Staff ID is required"),
  role: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required("Please select a role"),
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
