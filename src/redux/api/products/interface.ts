import type { ICategory, ICategoryParent } from "../categories";

export type ProductStatus = "active" | "archived" | "drafted";

export interface IDiscount {
  percentage?: number;
  price?: number;
  startDate?: string;
  endDate?: string;
  promotionName?: string;
}

export interface IVariant {
  _id?: string;
  name: string;
  sku?: string;
  basePrice: number;
  discount?: IDiscount;
  quantity: number;
  attributes?: Record<string, unknown>;
  tags?: string[];
  images?: string[];
  isActive?: boolean;
}

export interface IEngraving {
  available: boolean;
  fee: number;
  maxCharacters: number;
  maxLines: number;
  fonts: string[];
}

export interface IProduct {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  brand?: string;
  category: ICategory | ICategoryParent | string;
  basePrice: number;
  discount?: IDiscount;
  quantity: number;
  attributes?: Record<string, unknown>;
  tags: string[];
  coverImage?: string;
  images: string[];
  videos?: string[];
  weight?: string;
  isReturnable: boolean;
  returnableDays?: number;
  hasWarranty: boolean;
  warrantyYears?: number;
  engraving?: IEngraving;
  variants: IVariant[];
  status: ProductStatus;
  audience?: "men" | "women" | "unisex";
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  viewCount?: number;
  lowStockThreshold?: number;
  scheduledPublishAt?: string;
  variationGroup?: string;
  variationLabel?: string;
  variationValue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateProduct {
  name: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  brand?: string;
  category: string;
  basePrice: number;
  discount?: IDiscount;
  quantity?: number;
  attributes?: Record<string, unknown>;
  tags?: string[];
  coverImage?: string;
  images?: string[];
  videos?: string[];
  weight?: string;
  isReturnable?: boolean;
  returnableDays?: number;
  hasWarranty?: boolean;
  warrantyYears?: number;
  engraving?: IEngraving;
  variants?: IVariant[];
  status?: ProductStatus;
  audience?: "men" | "women" | "unisex";
  lowStockThreshold?: number;
  scheduledPublishAt?: string;
  variationGroup?: string;
  variationLabel?: string;
  variationValue?: string;
}

export interface IBulkStatusPayload {
  ids: string[];
  status: ProductStatus;
}

export interface IBulkDiscountPayload {
  ids: string[];
  percentage: number;
}

export interface IUpdateProduct extends Partial<ICreateProduct> {
  id: string;
}

export interface IProductListQuery {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  orderBy?: string;
  status?: string;
  category?: string;
}

export interface IUpdateProductStatus {
  id: string;
  status: ProductStatus;
}

export interface IAddVariant {
  productId: string;
  variant: IVariant;
}

export interface IUpdateVariant {
  productId: string;
  variantId: string;
  variant: Partial<IVariant>;
}

export interface IRemoveVariant {
  productId: string;
  variantId: string;
}

// Bulk import: category may be an id OR a slug.
export interface IBulkProductInput {
  name: string;
  description: string;
  brand?: string;
  category: string;
  basePrice: number;
  discount?: IDiscount;
  quantity?: number;
  attributes?: Record<string, unknown>;
  tags?: string[];
  coverImage?: string;
  images?: string[];
  weight?: string;
  isReturnable?: boolean;
  returnableDays?: number;
  hasWarranty?: boolean;
  warrantyYears?: number;
  engraving?: IEngraving;
  variants?: IVariant[];
  status?: ProductStatus;
}

export interface IBulkProductsPayload {
  products: IBulkProductInput[];
}

export interface IBulkProductsResult {
  createdCount: number;
  created: { _id: string; name: string }[];
  failed: { name: string; reason: string }[];
}

export interface IProductStats {
  total: number;
  active: number;
  archived: number;
  drafted: number;
  totalStock: number;
  lowStock: number;
}
