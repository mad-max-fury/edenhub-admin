export type AnalyticsRange = "7d" | "30d" | "90d" | "12m" | "all";

export interface IAnalyticsSummary {
  revenue: number;
  revenueDelta: number;
  orders: number;
  ordersDelta: number;
  avgOrderValue: number;
  newCustomers: number;
  customersDelta: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface ISalesPoint {
  period: string;
  revenue: number;
  orders: number;
}

export interface ITopProduct {
  product: string;
  name: string;
  image?: string;
  unitsSold: number;
  revenue: number;
}

export interface ICategorySales {
  category: string;
  name: string;
  revenue: number;
  units: number;
}

export interface IProductAnalytics {
  unitsSold: number;
  revenue: number;
  orderCount: number;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  stock: number;
  timeseries: { period: string; revenue: number; units: number }[];
}
