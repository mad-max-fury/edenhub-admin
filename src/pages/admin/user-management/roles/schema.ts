import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().trim().required("Please input role name"),
});
