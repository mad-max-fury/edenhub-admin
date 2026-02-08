import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

import { Button, Typography } from "@/components";
import Card from "@/components/Cards/Card";
import { TMTable } from "@/components/table/table";
import SellerCard from "./components/SellerCard";
import SalesChart from "./components/salesReport/SalesReport";

import {
  cardData,
  dashboardData,
  SALES_CHART_DATA_MAP,
  sellerData,
} from "@/components/constants/data";
import { dashboadColumns } from "@/components/constants/index";
import {
  selection,
  customStyle,
} from "@/pages/admin/dashboard/components/customselect/select";
import { watch } from "@/assets/images";

import type { DashboardRow } from "@/components/constants/data";
import type { Selection } from "@/pages/admin/dashboard/components/customselect/select";
import { AuthRouteConfig } from "@/constants/routes";

const Dashboard = () => {
  const navigate = useNavigate();
  const [topSellerFilter, setTopSellerFilter] = useState<Selection | null>(
    null,
  );
  const [chartPeriod, setChartPeriod] = useState("12 Months");
  const activeChartData = useMemo(() => {
    return (
      SALES_CHART_DATA_MAP[chartPeriod] || SALES_CHART_DATA_MAP["12 Months"]
    );
  }, [chartPeriod]);

  const sellers = useMemo(() => Array(5).fill(sellerData[0]), []);

  const handleExport = () => {
    console.log(`Exporting ${chartPeriod} Report...`);
  };

  return (
    <div className="flex flex-col gap-9 p-1">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cardData.map((card, idx) => (
          <Card key={`${card.title}-${idx}`} {...card} />
        ))}
      </section>

      <section className="flex flex-col md:flex-row gap-4 w-full ">
        <div className="flex-[2]  h-[350px] bg-white border border-gray-200 p-4 ">
          <SalesChart
            data={activeChartData}
            title="Sales Report"
            activePeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
            onExport={handleExport}
          />
        </div>

        <aside className="flex-1  h-auto md:h-[350px] md:max-w-[349px] bg-white border border-gray-200  flex flex-col overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-gray-50">
            <Typography variant="h-s" fontWeight="bold">
              Top Seller
            </Typography>
            <div className="w-32">
              <Select
                options={selection}
                value={topSellerFilter}
                styles={customStyle}
                onChange={setTopSellerFilter}
                placeholder="7 Days"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar">
            {sellers.map((seller, idx) => (
              <div key={idx}>
                <SellerCard {...seller} image={watch} />
                {idx !== sellers.length - 1 && (
                  <hr className="my-3 border-gray-50" />
                )}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="w-full">
        <TMTable<DashboardRow>
          columns={dashboadColumns(navigate)}
          data={dashboardData}
          headerData={
            <div className="w-full items-center px-6 py-3 flex justify-between">
              <Typography variant={"h-s"} fontWeight={"bold"}>
                Recent Orders
              </Typography>
              <Link to={AuthRouteConfig.ORDERS}>
                <Button size={"sm"}>View Orders</Button>
              </Link>
            </div>
          }
          loading={false}
          className="bg-white overflow-hidden"
          headerClassName="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold"
        />
      </section>
    </div>
  );
};

export default Dashboard;
