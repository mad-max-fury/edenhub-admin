import { useState, useMemo } from "react";
import { Tab } from "@/components/tabs/tab";
import Card from "@/components/Cards/Card";
import ProductsTable from "./components/productsTable";
import type { ProductRow } from "./components/productTableColums";

const productCardData = [
  {
    title: "TOTAL ORDERS",
    value: "84,382",
    rate: 36,
    isUp: true,
    isCurrency: false,
  },
  {
    title: "TOTAL SALES",
    value: "2,308,485",
    rate: 14,
    isUp: false,
    isCurrency: true,
  },
  {
    title: "PENDING DELIVERY",
    value: "84,382",
    rate: 36,
    isUp: true,
    isCurrency: false,
  },
  {
    title: "COMPLETED ORDERS",
    value: "33,493",
    rate: 36,
    isUp: true,
    isCurrency: false,
  },
];

export const productListData: ProductRow[] = [
  {
    name: "Eden Chrono Elite",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
    creationDate: "12 Nov, 2024",
    sku: "SKU# 96084",
    variants: "3 Variants",
    price: 778.35,
    quantity: 12,
    status: "active",
  },
  {
    name: "Aero Stealth Black",
    image:
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=200&auto=format&fit=crop",
    creationDate: "14 Nov, 2024",
    sku: "SKU# 96085",
    variants: "2 Variants",
    price: 1250.0,
    quantity: 8,
    status: "active",
  },
  {
    name: "Vanguard Rose Gold",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200&auto=format&fit=crop",
    creationDate: "15 Nov, 2024",
    sku: "SKU# 96086",
    variants: "4 Variants",
    price: 899.99,
    quantity: 25,
    status: "active",
  },
  {
    name: "Legacy Leather Classic",
    image:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=200&auto=format&fit=crop",
    creationDate: "10 Nov, 2024",
    sku: "SKU# 96087",
    variants: "1 Variant",
    price: 450.5,
    quantity: 0,
    status: "archived",
  },
  {
    name: "Oceanic Diver Pro",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=200&auto=format&fit=crop",
    creationDate: "18 Nov, 2024",
    sku: "SKU# 96088",
    variants: "3 Variants",
    price: 1580.0,
    quantity: 5,
    status: "active",
  },
  {
    name: "Summit Field Watch",
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=200&auto=format&fit=crop",
    creationDate: "20 Nov, 2024",
    sku: "SKU# 96089",
    variants: "2 Variants",
    price: 320.0,
    quantity: 15,
    status: "drafted",
  },
  {
    name: "Titanium Executive",
    image:
      "https://images.unsplash.com/photo-1508685096489-7aac291ba597?q=80&w=200&auto=format&fit=crop",
    creationDate: "21 Nov, 2024",
    sku: "SKU# 96090",
    variants: "5 Variants",
    price: 2100.0,
    quantity: 3,
    status: "active",
  },
  {
    name: "Horizon Minimalist",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=200&auto=format&fit=crop",
    creationDate: "22 Nov, 2024",
    sku: "SKU# 96091",
    variants: "3 Variants",
    price: 195.0,
    quantity: 50,
    status: "active",
  },
];

type ProductStatus = "all" | "active" | "archived" | "drafted";

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState<ProductStatus>("all");

  const filteredData = useMemo(() => {
    if (activeTab === "all") return productListData;
    return productListData.filter(
      (product) => product.status.toLowerCase() === activeTab,
    );
  }, [activeTab]);

  const tabs = [
    {
      label: "ALL PRODUCTS",
      query: "all",
      content: <ProductsTable data={filteredData} />,
    },
    {
      label: "ACTIVE PRODUCTS",
      query: "active",
      content: <ProductsTable data={filteredData} />,
    },
    {
      label: "ARCHIVED PRODUCTS",
      query: "archived",
      content: <ProductsTable data={filteredData} />,
    },
    {
      label: "DRAFTED PRODUCTS",
      query: "drafted",
      content: <ProductsTable data={filteredData} />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {productCardData.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            price={card.value}
            rate={card.rate}
            isCurrency={card.isCurrency}
            isUp={card.isUp}
          />
        ))}
      </div>

      <div className="relative">
        <Tab
          tabs={tabs}
          activeTab={activeTab}
          onChange={(query) => setActiveTab(query as ProductStatus)}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
