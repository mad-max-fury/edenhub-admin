import { useState } from "react";
import Card from "@/components/Cards/Card";
import { Tab } from "@/components/tabs/tab";
import OrdersTable from "@/pages/admin/orders/components/ordersTable";
import { useGetOrderStatsQuery } from "@/redux/api/orders";

type OrderTab = "all" | "fulfilled" | "unfulfilled";

const pct = (part: number, total: number) =>
  total ? Math.round((part / total) * 100) : 0;

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const { data: statsRes } = useGetOrderStatsQuery();
  const stats = statsRes?.data;

  const cards = [
    {
      title: "TOTAL ORDERS",
      value: (stats?.totalOrders ?? 0).toLocaleString(),
      rate: pct(stats?.completed ?? 0, stats?.totalOrders ?? 0),
      isUp: true,
    },
    {
      title: "TOTAL SALES",
      value: `₦${(stats?.totalSales ?? 0).toLocaleString()}`,
      rate: pct(stats?.totalOrders ?? 0, stats?.totalOrders ?? 0),
      isUp: true,
    },
    {
      title: "FULFILLED ORDERS",
      value: (stats?.fulfilled ?? 0).toLocaleString(),
      rate: pct(stats?.fulfilled ?? 0, stats?.totalOrders ?? 0),
      isUp: true,
    },
    {
      title: "UNFULFILLED ORDERS",
      value: (stats?.unfulfilled ?? 0).toLocaleString(),
      rate: pct(stats?.unfulfilled ?? 0, stats?.totalOrders ?? 0),
      isUp: false,
    },
  ];

  const tabs = [
    { label: "All Orders", query: "all", content: <OrdersTable status="all" /> },
    {
      label: "Fulfilled Orders",
      query: "fulfilled",
      content: <OrdersTable status="fulfilled" />,
    },
    {
      label: "Unfulfilled Orders",
      query: "unfulfilled",
      content: <OrdersTable status="unfulfilled" />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
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
      </div>
      <Tab
        tabs={tabs}
        activeTab={activeTab}
        onChange={(query) => setActiveTab(query as OrderTab)}
      />
    </div>
  );
};

export default OrdersPage;
