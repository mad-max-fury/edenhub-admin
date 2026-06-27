import * as yup from "yup";
import type { ICategoryAttribute } from "./types";

const makeAttrShape = (attributes: ICategoryAttribute[]) => {
  const shape: Record<string, yup.Schema> = {};
  attributes.forEach((attr) => {
    if (attr.isRequired) {
      shape[attr.id] = yup
        .string()
        .trim()
        .required(`${attr.name} is required`)
        .typeError(`${attr.name} must be text`);
    } else {
      shape[attr.id] = yup
        .string()
        .trim()
        .nullable()
        .optional()
        .typeError(`${attr.name} must be text`);
    }
  });
  return shape;
};

const selectItemShape = yup.object({
  label: yup.string().required(),
  value: yup.string().required(),
});

const pictureShape = yup.object({
  id: yup.string().required(),
  preview: yup.string().optional(),
});

const discountFields = {
  discountPercentage: yup.number().optional().min(0).max(100),
  discountedPrice: yup
    .number()
    .optional()
    .test("lt-base", "Must be less than base price", function (val) {
      const { basePrice } = this.parent;
      if (val !== undefined && val > 0 && basePrice) return val < basePrice;
      return true;
    }),
  discountStartDate: yup.string().optional(),
  discountEndDate: yup
    .string()
    .optional()
    .test("after-start", "Must be after start date", function (val) {
      const { discountStartDate } = this.parent;
      if (val && discountStartDate)
        return new Date(val) > new Date(discountStartDate);
      return true;
    }),
  promotionName: yup.string().optional(),
};

export const buildProductSchema = (attributes: ICategoryAttribute[] = []) => {
  const attrShape = makeAttrShape(attributes);

  const variantSchema = yup.object({
    name: yup
      .string()
      .required("Variant name is required")
      .min(2, "Min 2 characters")
      .max(100, "Max 100 characters"),
    basePrice: yup
      .number()
      .typeError("Price must be a number")
      .required("Base price is required")
      .positive()
      .min(1, "Min ₦1"),
    ...discountFields,
    quantity: yup
      .number()
      .typeError("Must be a number")
      .required("Quantity is required")
      .min(0)
      .integer(),
    pictures: yup.array().of(pictureShape).default([]),

    attributes: yup.lazy(() =>
      Object.keys(attrShape).length > 0
        ? yup.object().shape(attrShape).default({})
        : yup.object().default({}),
    ),
    tags: yup.array().of(selectItemShape).default([]),
  });

  return yup.object({
    productName: yup
      .string()
      .required("Product name is required")
      .min(2, "Min 2 characters")
      .max(100, "Max 100 characters"),
    brand: yup.string().optional(),
    description: yup
      .string()
      .required("Description is required")
      .min(10, "Min 10 characters"),
    basePrice: yup
      .number()
      .typeError("Price must be a number")
      .required("Base price is required")
      .positive()
      .min(1, "Min ₦1"),
    ...discountFields,
    isReturnable: yup.boolean().required(),
    returnableDays: yup
      .number()
      .optional()
      .when("isReturnable", {
        is: true,
        then: (s) =>
          s.required("Required").min(1).max(30).typeError("Must be a number"),
      }),
    hasWarranty: yup.boolean().required(),
    warrantyYears: yup
      .number()
      .optional()
      .when("hasWarranty", {
        is: true,
        then: (s) =>
          s.required("Required").min(1).max(10).typeError("Must be a number"),
      }),
    engravingAvailable: yup.boolean().required(),
    engravingFee: yup
      .number()
      .optional()
      .when("engravingAvailable", {
        is: true,
        then: (s) =>
          s.required("Required").min(0).typeError("Must be a number"),
      }),
    engravingMaxCharacters: yup
      .number()
      .optional()
      .when("engravingAvailable", {
        is: true,
        then: (s) =>
          s.required("Required").min(1).max(200).typeError("Must be a number"),
      }),
    engravingMaxLines: yup
      .number()
      .optional()
      .when("engravingAvailable", {
        is: true,
        then: (s) =>
          s.required("Required").min(1).max(10).typeError("Must be a number"),
      }),
    engravingFonts: yup.string().optional(),
    weight: yup.string().optional(),
    tags: yup
      .array()
      .of(selectItemShape)
      .min(1, "At least one tag required")
      .required("Tags are required"),
    category: selectItemShape.required("Category is required"),
    quantity: yup
      .number()
      .typeError("Must be a number")
      .required("Quantity is required")
      .min(0)
      .integer(),
    coverImage: yup.mixed().optional(),
    pictures: yup.array().of(pictureShape).default([]),
    attributes: yup.lazy(() =>
      Object.keys(attrShape).length > 0
        ? yup.object().shape(attrShape).default({})
        : yup.object().default({}),
    ),
    variants: yup.array().of(variantSchema).default([]),
  });
};
