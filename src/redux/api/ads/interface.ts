export interface IAdProduct {
  _id: string;
  name: string;
  coverImage?: string;
  images?: string[];
}

export interface IAd {
  _id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  placement: "hero" | "shop" | "both";
  products: IAdProduct[] | string[];
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export interface ICreateAd {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  placement?: string;
  products?: string[];
  isActive?: boolean;
  order?: number;
}
