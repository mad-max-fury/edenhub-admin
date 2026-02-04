import WatchImage from "@/assets/images/Watch2.jpeg"; 



export const cardData = [
  { title: "Today's Sales", price: "12,426", rate: 36, isCurrency: true, isUp: true },
  { title: "Total Sales", price: "2,308,485", rate: 14, isCurrency: true, isUp: false },
  { title: "Total Orders", price: "84,382", rate: 36, isCurrency: false, isUp: true },
  { title: "Total Customers", price: "33,493", rate: 36, isCurrency: false, isUp: true },
];

export const sellerData = [
  {
    name: "Eden Chrono Elite",
    product: "Watches",
    rate: 36,
    image: " watch6,",
    isUp: true,
  },
];
 export type SellerItemsProps = {
  name: string;
  product: string;
  rate: number;
  image: string; 
  isUp: boolean;
};

export type Product = {
  name: string;
  description: string;
  packaging: string;
  quantity?: number;
  image: string; 
};



export type DashboardRow = {
  order: string;
  date: string;
  customer: string;
  payment: string;
  total: string;
  items: number;
  products: Product[];
  fulfillment: string;
  unfulfillment: string;
};

export const dashboardData: DashboardRow[] = [
  {
    order: "ORD-001",
    date: "2026-01-14",
    customer: "John Doe",
    payment: "Pending",
    total: "$150.00",
    items: 3,
    fulfillment: "Fulfilled",
    unfulfillment: "Unfulfilled",
    products: [
      {
        name: "Timeless Gold Royale",
        description: "Buckle Engraving, Dial Engraving, Back Case Engraving",
        packaging: "Classic Wooden Box",
        image: WatchImage,
      },
      
    ],
  },
  {
    order: "ORD-002",
    date: "2026-01-13",
    customer: "Jane Smith",
    payment: "Success",
    total: "$250.00",
    items: 5,
    fulfillment: "Fulfilled",
    unfulfillment: "Unfulfilled",
    products: [
      {
        name: "Smart Watch 6",
        description: "Buckle Engraving, Dial Engraving, Back Case Engraving",
        packaging: "Classic Wooden Box",
        image: WatchImage,
      },
    ],
  },
];