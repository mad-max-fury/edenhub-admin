import WatchImage from "@/assets/images/Watch2.jpeg";

export const cardData = [
  {
    title: "Today's Sales",
    price: "12,426",
    rate: 36,
    isCurrency: true,
    isUp: true,
  },
  {
    title: "Total Sales",
    price: "2,308,485",
    rate: 14,
    isCurrency: true,
    isUp: false,
  },
  {
    title: "Total Orders",
    price: "84,382",
    rate: 36,
    isCurrency: false,
    isUp: true,
  },
  {
    title: "Total Customers",
    price: "33,493",
    rate: 36,
    isCurrency: false,
    isUp: true,
  },
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
};

export const dashboardData: DashboardRow[] = [
  {
    order: "ORD-001",
    date: "2026-01-14",
    customer: "John Doe",
    payment: "Pending",
    total: "$150.00",
    items: 3,
    fulfillment: "pending",
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
    payment: "Paid",
    total: "$250.00",
    items: 5,
    fulfillment: "Delivered",
    products: [
      {
        name: "Smart Watch 6",
        description: "Heart Rate, GPS, Waterproof",
        packaging: "Premium Box",
        image: WatchImage,
      },
      // {
      //   name: "Leather Strap Classic",
      //   description: "Brown Leather, Adjustable",
      //   packaging: "Plastic Sleeve",
      //   image: WatchImage,
      // },
    ],
  },
  {
    order: "ORD-003",
    date: "2026-01-12",
    customer: "Michael Johnson",
    payment: "Failed",
    total: "$90.00",
    items: 1,
    fulfillment: "Cancelled",
    products: [
      {
        name: "Minimal Silver Watch",
        description: "Slim Dial, Stainless Steel",
        packaging: "Classic Wooden Box",
        image: WatchImage,
      },
    ],
  },
  {
    order: "ORD-004",
    date: "2026-01-11",
    customer: "Aisha Bello",
    payment: "Paid",
    total: "$320.00",
    items: 4,
    fulfillment: "Shipped",
    products: [
      {
        name: "Chrono Sport Pro",
        description: "Chronograph, Water Resistant",
        packaging: "Sport Box",
        image: WatchImage,
      },
      // {
      //   name: "Rubber Strap Black",
      //   description: "Sweat Resistant",
      //   packaging: "Plastic Sleeve",
      //   image: WatchImage,
      // },
    ],
  },
  {
    order: "ORD-005",
    date: "2026-01-10",
    customer: "David Lee",
    payment: "Paid",
    total: "$180.00",
    items: 2,
    fulfillment: "Delivered",
    products: [
      {
        name: "Rose Gold Elite",
        description: "Dial Engraving, Back Case Engraving",
        packaging: "Luxury Box",
        image: WatchImage,
      },
    ],
  },
  {
    order: "ORD-006",
    date: "2026-01-09",
    customer: "Fatima Hassan",
    payment: "Pending",
    total: "$210.00",
    items: 3,
    fulfillment: "pending",
    products: [
      {
        name: "Ocean Blue Diver",
        description: "300m Water Resistant, Luminous Hands",
        packaging: "Waterproof Case",
        image: WatchImage,
      },
    ],
  },
];

export const SALES_CHART_DATA_MAP: Record<string, any[]> = {
  "12 Months": [
    { name: "Jan", value: 35000, year: 2024 },
    { name: "Feb", value: 38000, year: 2024 },
    { name: "Mar", value: 32000, year: 2024 },
    { name: "Apr", value: 42000, year: 2024 },
    { name: "May", value: 40000, year: 2024 },
    { name: "Jun", value: 45591, year: 2024 },
    { name: "Jul", value: 42000, year: 2024 },
    { name: "Aug", value: 40000, year: 2024 },
    { name: "Sep", value: 52000, year: 2024 },
    { name: "Oct", value: 48000, year: 2024 },
    { name: "Nov", value: 55000, year: 2024 },
    { name: "Dec", value: 58000, year: 2024 },
  ],
  "6 Months": [
    { name: "Jul", value: 42000, year: 2024 },
    { name: "Aug", value: 40000, year: 2024 },
    { name: "Sep", value: 52000, year: 2024 },
    { name: "Oct", value: 48000, year: 2024 },
    { name: "Nov", value: 55000, year: 2024 },
    { name: "Dec", value: 61000, year: 2024 },
  ],
  "30 Days": [
    { name: "WK 1", value: 12000, year: 2024 },
    { name: "WK 2", value: 15000, year: 2024 },
    { name: "WK 3", value: 11000, year: 2024 },
    { name: "Wk 4", value: 18000, year: 2024 },
  ],
  "7 Days": [
    { name: "Mon", value: 2100, year: 2024 },
    { name: "Tue", value: 4800, year: 2024 },
    { name: "Wed", value: 3200, year: 2024 },
    { name: "Thu", value: 5100, year: 2024 },
    { name: "Fri", value: 4900, year: 2024 },
    { name: "Sat", value: 6200, year: 2024 },
    { name: "Sun", value: 5800, year: 2024 },
  ],
};
