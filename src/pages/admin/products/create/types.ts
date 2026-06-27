// ─── Category & Attribute types ───────────────────────────────────────────────
export type AttributeInputType = "text" | "select" | "radio" | "checkbox";

export interface AttributeOption {
  label: string;
  value: string;
}

export interface ICategoryAttribute {
  id: string;
  name: string;
  inputType: AttributeInputType;
  isRequired: boolean;
  order: number;
  options: AttributeOption[];
}

export interface ICategory {
  id: string;
  name: string;
  parentId?: string;
  subcategories?: ICategory[];
  attributes?: ICategoryAttribute[];
}

// ─── Select item ──────────────────────────────────────────────────────────────
export interface ISelectItem {
  label: string;
  value: string;
}

// ─── Image ────────────────────────────────────────────────────────────────────
export interface ProductPicture {
  id: string;
  file?: File | null;
  preview?: string;
}

// ─── Variant ──────────────────────────────────────────────────────────────────
export interface IVariant {
  name: string;
  basePrice: number;
  discountPercentage?: number;
  discountedPrice?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  promotionName?: string;
  quantity: number;
  pictures: ProductPicture[];
  attributes: Record<string, string | undefined>;
  tags: ISelectItem[];
}

// ─── Root form ────────────────────────────────────────────────────────────────
export interface ProductFormData {
  productName: string;
  brand?: string;
  description: string;
  basePrice: number;
  discountPercentage?: number;
  discountedPrice?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  promotionName?: string;
  isReturnable: boolean;
  returnableDays?: number;
  hasWarranty: boolean;
  warrantyYears?: number;
  engravingAvailable: boolean;
  engravingFee?: number;
  engravingMaxCharacters?: number;
  engravingMaxLines?: number;
  engravingFonts?: string;
  weight?: string;
  tags: ISelectItem[];
  category: ISelectItem;
  quantity: number;
  coverImage?: ProductPicture;
  pictures: ProductPicture[];
  attributes: Record<string, string | undefined>;
  variants: IVariant[];
  metaTitle?: string;
  metaDescription?: string;
  audience?: string;
  videoUrls?: string;
  lowStockThreshold?: number;
  scheduledPublishAt?: string;
  variationGroup?: string;
  variationLabel?: string;
  variationValue?: string;
}
