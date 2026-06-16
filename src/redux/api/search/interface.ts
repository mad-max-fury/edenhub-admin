export type SearchHitType = "product" | "order" | "customer" | "category";

export interface ISearchHit {
  id: string;
  type: SearchHitType;
  title: string;
  subtitle?: string;
  image?: string;
}

export interface IGlobalSearchData {
  products: ISearchHit[];
  orders: ISearchHit[];
  customers: ISearchHit[];
  categories: ISearchHit[];
  total: number;
}
