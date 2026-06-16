import * as yup from "yup";

export const ATTRIBUTE_INPUT_TYPES = [
  { label: "Text", value: "text" },
  { label: "Select (dropdown)", value: "select" },
  { label: "Radio (single choice)", value: "radio" },
  { label: "Checkbox (multi choice)", value: "checkbox" },
] as const;

export const inputTypeNeedsOptions = (inputType?: string) =>
  inputType === "select" || inputType === "radio" || inputType === "checkbox";

const optionSchema = yup.object({
  label: yup.string().trim().required("Label is required"),
  value: yup.string().trim().required("Value is required"),
});

const attributeSchema = yup.object({
  _id: yup.string().optional(),
  name: yup
    .string()
    .trim()
    .required("Attribute name is required")
    .min(2, "Min 2 characters"),
  inputType: yup
    .string()
    .oneOf(["text", "select", "radio", "checkbox"])
    .required("Input type is required"),
  isRequired: yup.boolean().default(false),
  order: yup.number().default(0),
  options: yup
    .array()
    .of(optionSchema)
    .default([])
    .when("inputType", {
      is: (val: string) => inputTypeNeedsOptions(val),
      then: (s) => s.min(1, "Add at least one option"),
    }),
});

export const categorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Category name is required")
    .min(2, "Min 2 characters")
    .max(80, "Max 80 characters"),
  description: yup.string().trim().max(300, "Max 300 characters").optional(),
  parent: yup.string().nullable().optional(),
  image: yup.string().optional(),
  isActive: yup.boolean().default(true),
  attributes: yup.array().of(attributeSchema).default([]),
});

export type CategoryFormValues = yup.InferType<typeof categorySchema>;
