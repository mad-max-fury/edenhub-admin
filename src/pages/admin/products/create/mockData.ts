import type { ICategory, ISelectItem } from "./types";

export const MOCK_CATEGORIES: ICategory[] = [
  {
    id: "electronics",
    name: "Electronics",
    attributes: [
      {
        id: "attr_brand",
        name: "Brand",
        inputType: "text",
        isRequired: true,
        order: 1,
        options: [],
      },
      {
        id: "attr_condition",
        name: "Condition",
        inputType: "radio",
        isRequired: true,
        order: 2,
        options: [
          { label: "New", value: "new" },
          { label: "Refurbished", value: "refurbished" },
          { label: "Used", value: "used" },
        ],
      },
      {
        id: "attr_warranty_type",
        name: "Warranty Type",
        inputType: "select",
        isRequired: false,
        order: 3,
        options: [
          { label: "Manufacturer", value: "manufacturer" },
          { label: "Store", value: "store" },
          { label: "None", value: "none" },
        ],
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    attributes: [
      {
        id: "attr_size",
        name: "Available Sizes",
        inputType: "checkbox",
        isRequired: true,
        order: 1,
        options: [
          { label: "XS", value: "xs" },
          { label: "S", value: "s" },
          { label: "M", value: "m" },
          { label: "L", value: "l" },
          { label: "XL", value: "xl" },
          { label: "XXL", value: "xxl" },
        ],
      },
      {
        id: "attr_color",
        name: "Color",
        inputType: "text",
        isRequired: true,
        order: 2,
        options: [],
      },
      {
        id: "attr_material",
        name: "Material",
        inputType: "select",
        isRequired: false,
        order: 3,
        options: [
          { label: "Cotton", value: "cotton" },
          { label: "Polyester", value: "polyester" },
          { label: "Linen", value: "linen" },
          { label: "Silk", value: "silk" },
        ],
      },
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    attributes: [
      {
        id: "attr_dims",
        name: "Dimensions",
        inputType: "text",
        isRequired: false,
        order: 1,
        options: [],
      },
      {
        id: "attr_room",
        name: "Room Type",
        inputType: "select",
        isRequired: false,
        order: 2,
        options: [
          { label: "Living Room", value: "living" },
          { label: "Bedroom", value: "bedroom" },
          { label: "Kitchen", value: "kitchen" },
          { label: "Bathroom", value: "bathroom" },
        ],
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    attributes: [
      {
        id: "attr_skin",
        name: "Skin Type",
        inputType: "checkbox",
        isRequired: false,
        order: 1,
        options: [
          { label: "Oily", value: "oily" },
          { label: "Dry", value: "dry" },
          { label: "Combination", value: "combination" },
          { label: "Sensitive", value: "sensitive" },
        ],
      },
      {
        id: "attr_vol",
        name: "Volume / Weight",
        inputType: "text",
        isRequired: false,
        order: 2,
        options: [],
      },
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    attributes: [
      {
        id: "attr_sport",
        name: "Sport",
        inputType: "select",
        isRequired: false,
        order: 1,
        options: [
          { label: "Football", value: "football" },
          { label: "Basketball", value: "basketball" },
          { label: "Tennis", value: "tennis" },
          { label: "Running", value: "running" },
          { label: "Gym / Fitness", value: "gym" },
        ],
      },
      {
        id: "attr_level",
        name: "Skill Level",
        inputType: "radio",
        isRequired: false,
        order: 2,
        options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Professional", value: "professional" },
        ],
      },
    ],
  },
];

export const TAG_SUGGESTIONS: ISelectItem[] = [
  { label: "New Arrival", value: "new-arrival" },
  { label: "Best Seller", value: "best-seller" },
  { label: "On Sale", value: "on-sale" },
  { label: "Limited Edition", value: "limited-edition" },
  { label: "Featured", value: "featured" },
  { label: "Trending", value: "trending" },
  { label: "Clearance", value: "clearance" },
];
