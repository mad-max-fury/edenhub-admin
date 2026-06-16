import { useState } from "react";
import { Tab } from "@/components/tabs/tab";
import Card from "@/components/Cards/Card";
import ProductsTable from "./components/productsTable";
import { useGetProductStatsQuery } from "@/redux/api/products";

type ProductStatusTab = "all" | "active" | "archived" | "drafted";

const pct = (part: number, total: number) =>
  total ? Math.round((part / total) * 100) : 0;

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState<ProductStatusTab>("all");
  const { data: statsRes } = useGetProductStatsQuery();
  const stats = statsRes?.data;

  const cards = [
    {
      title: "TOTAL PRODUCTS",
      value: (stats?.total ?? 0).toLocaleString(),
      rate: pct(stats?.active ?? 0, stats?.total ?? 0),
      isUp: true,
    },
    {
      title: "ACTIVE PRODUCTS",
      value: (stats?.active ?? 0).toLocaleString(),
      rate: pct(stats?.active ?? 0, stats?.total ?? 0),
      isUp: true,
    },
    {
      title: "TOTAL STOCK",
      value: (stats?.totalStock ?? 0).toLocaleString(),
      rate: 100,
      isUp: true,
    },
    {
      title: "LOW STOCK",
      value: (stats?.lowStock ?? 0).toLocaleString(),
      rate: pct(stats?.lowStock ?? 0, stats?.total ?? 0),
      isUp: false,
    },
  ];

  const tabs = [
    { label: "ALL PRODUCTS", query: "all", content: <ProductsTable status="all" /> },
    {
      label: "ACTIVE PRODUCTS",
      query: "active",
      content: <ProductsTable status="active" />,
    },
    {
      label: "ARCHIVED PRODUCTS",
      query: "archived",
      content: <ProductsTable status="archived" />,
    },
    {
      label: "DRAFTED PRODUCTS",
      query: "drafted",
      content: <ProductsTable status="drafted" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            price={card.value}
            rate={card.rate}
            isUp={card.isUp}
          />
        ))}
      </div>

      <div className="relative">
        <Tab
          tabs={tabs}
          activeTab={activeTab}
          onChange={(query) => setActiveTab(query as ProductStatusTab)}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
