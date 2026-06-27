export type ShopReviewStatus = "pending" | "approved" | "rejected";

export interface IShopReview {
  _id: string;
  name: string;
  email?: string;
  title?: string;
  comment: string;
  rating: number;
  image?: string;
  status: ShopReviewStatus;
  createdAt?: string;
}

export interface ICreateShopReview {
  name: string;
  email?: string;
  title?: string;
  comment: string;
  rating: number;
  image?: string;
}

export interface IShopReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgRating: number;
}
