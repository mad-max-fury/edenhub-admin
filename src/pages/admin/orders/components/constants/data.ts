
import { cardData as dashboardCardData } from "@/components/constants/data";


const orderTitles = [
  "Total Orders",
  "Total Sales",
  "Fulfilled Orders",
  "Unfulfilled Orders",
];

export const orderCardData = dashboardCardData.map((card, idx) => ({
  ...card,
  title: orderTitles[idx], 
  isCurrency: false,      
}));

export const orderSummary = [
  { label: "Product Cost", price: "$120.00" },
  { label: "Shipment Cost", price: "$10.00" },
  { label: "Discount", price: "-$15.00" },
  { label: "Gift Card", price: "-$20.00" },
  { label: "Subtotal", price: "$95.00" },
  { label: "Total", price: "$95.00" },
];

