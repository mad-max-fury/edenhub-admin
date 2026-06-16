export type AttributeInputType = "text" | "select" | "radio" | "checkbox";

export interface IAttributeOption {
  label: string;
  value: string;
}

export interface ICategoryAttribute {
  _id?: string;
  name: string;
  inputType: AttributeInputType;
  isRequired: boolean;
  order: number;
  options: IAttributeOption[];
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: ICategoryParent | string | null;
  level: number;
  image?: string;
  isActive: boolean;
  attributes: ICategoryAttribute[];
  // Present only on the tree endpoint.
  subcategories?: ICategory[];
  // Present only on the single-category endpoint (own + ancestor attributes).
  inheritedAttributes?: ICategoryAttribute[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryParent {
  _id: string;
  name: string;
  slug: string;
  level: number;
}

export interface ICreateCategory {
  name: string;
  slug?: string;
  description?: string;
  parent?: string | null;
  image?: string;
  isActive?: boolean;
  attributes?: ICategoryAttribute[];
}

export interface IUpdateCategory extends Partial<ICreateCategory> {
  id: string;
}

export interface IAddAttribute {
  categoryId: string;
  attribute: ICategoryAttribute;
}

export interface IUpdateAttribute {
  categoryId: string;
  attributeId: string;
  attribute: Partial<ICategoryAttribute>;
}

export interface IRemoveAttribute {
  categoryId: string;
  attributeId: string;
}

// Nested node accepted by the bulk JSON import endpoint.
export interface IBulkCategoryNode {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  attributes?: ICategoryAttribute[];
  subcategories?: IBulkCategoryNode[];
}

export interface IBulkImportPayload {
  categories: IBulkCategoryNode[];
}

export interface IBulkImportResult {
  createdCount: number;
  created: { _id: string; name: string; level: number }[];
  failed: { name: string; reason: string }[];
}
