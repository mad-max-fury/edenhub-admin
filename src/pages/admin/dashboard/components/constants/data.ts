


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


export type DashboardRow = {
  order: string;
  date: string;
  customer: string;
  payment: string;
  total: string;
  items: number;
  fulfillment: string;
};





export const dashboardData: DashboardRow[] = [
    {
    order: "ORD-001",
    date: "2026-01-14",
    customer: "John Doe",
    payment: "pending",
    total: "$150.00",
    items: 3,
    fulfillment: "fulfiled",
  },
  {
    order: "ORD-002",
    date: "2026-01-13",
    customer: "Jane Smith",
    payment: "success",
    total: "$250.00",
    items: 5,
    fulfillment: "fulfiled",
  },
  
];




