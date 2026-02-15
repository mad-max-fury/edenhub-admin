import { useState, useMemo } from "react";
import { dashboardData } from "@/components/constants/data";
import Card from "@/components/Cards/Card";
import { orderCardData } from "@/pages/admin/orders/components/constants/data";
import { Tab } from "@/components/tabs/tab";
import OrdersTable from "@/pages/admin/orders/components/ordersTable";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "fulfilled" | "unfulfilled"
  >("all");

  const filteredData = useMemo(() => {
    if (activeTab === "fulfilled") {
      return dashboardData.filter(
        (row) => row.fulfillment.toUpperCase() === "fulfilled",
      );
    }
    if (activeTab === "unfulfilled") {
      return dashboardData.filter(
        (row) => row.fulfillment.toUpperCase() !== "fulfilled",
      );
    }
    return dashboardData;
  }, [activeTab]);

  const tabs = [
    {
      label: "All Orders",
      query: "all",
      content: <OrdersTable data={filteredData} />,
    },
    {
      label: "Fulfilled Orders",
      query: "fulfilled",
      content: <OrdersTable data={filteredData} />,
    },
    {
      label: "Unfulfilled Orders",
      query: "unfulfilled",
      content: <OrdersTable data={filteredData} />,
    },
  ];

  return (
    <div className=" ">
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {orderCardData.map((card, idx) => (
            <Card
              key={idx}
              title={card.title}
              price={card.price}
              rate={card.rate}
              isCurrency={card.isCurrency}
              isUp={card.isUp}
            />
          ))}
        </div>
      </div>
      <Tab
        tabs={tabs}
        activeTab={activeTab}
        onChange={(query) =>
          setActiveTab(query as "all" | "fulfilled" | "unfulfilled")
        }
      />
    </div>
  );
};

export default OrdersPage;
