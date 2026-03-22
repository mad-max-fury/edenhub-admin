import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().trim().required("please input menu name"),
});

export const addPermissionsSchema = yup.object().shape({
  permissions: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Please select a permissions"),
        value: yup.string().required("Please select a permissions"),
      }),
    )
    .min(1, "Please select at least one permissions")
    .required("Please select a permissions"),
});
