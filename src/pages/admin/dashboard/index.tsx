import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge, Button, Typography } from "@/components";
import Card from "@/components/Cards/Card";
import { TMTable } from "@/components/table/table";
import SalesChart from "./components/salesReport/SalesReport";
import { AuthRouteConfig } from "@/constants/routes";

import {
  useGetAnalyticsSummaryQuery,
  useGetSalesTimeseriesQuery,
  useGetTopProductsQuery,
  useGetRecentOrdersQuery,
  type AnalyticsRange,
} from "@/redux/api/analytics";
import type { IOrder } from "@/redux/api/orders";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const PERIODS = [
  { label: "12 Months", range: "12m" as AnalyticsRange },
  { label: "90 Days", range: "90d" as AnalyticsRange },
  { label: "30 Days", range: "30d" as AnalyticsRange },
  { label: "7 Days", range: "7d" as AnalyticsRange },
];

const customerName = (c: IOrder["customer"]) =>
  typeof c === "string" ? "—" : `${c.firstName} ${c.lastName}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [periodLabel, setPeriodLabel] = useState("30 Days");
  const range = PERIODS.find((p) => p.label === periodLabel)?.range ?? "30d";

  const { data: summaryRes } = useGetAnalyticsSummaryQuery({ range });
  const { data: seriesRes } = useGetSalesTimeseriesQuery({ range });
  const { data: topRes } = useGetTopProductsQuery({ range, limit: 5 });
  const { data: recentRes, isFetching } = useGetRecentOrdersQuery({ limit: 8 });

  const s = summaryRes?.data;
  const chartData = useMemo(
    () =>
      (seriesRes?.data ?? []).map((p) => ({ name: p.period, value: p.revenue })),
    [seriesRes],
  );
  const topProducts = topRes?.data ?? [];
  const orders = recentRes?.data ?? [];

  const cards = [
    {
      title: "REVENUE",
      price: money(s?.revenue),
      rate: Math.round(Math.abs(s?.revenueDelta ?? 0)),
      isUp: (s?.revenueDelta ?? 0) >= 0,
    },
    {
      title: "ORDERS",
      price: (s?.orders ?? 0).toLocaleString(),
      rate: Math.round(Math.abs(s?.ordersDelta ?? 0)),
      isUp: (s?.ordersDelta ?? 0) >= 0,
    },
    {
      title: "NEW CUSTOMERS",
      price: (s?.newCustomers ?? 0).toLocaleString(),
      rate: Math.round(Math.abs(s?.customersDelta ?? 0)),
      isUp: (s?.customersDelta ?? 0) >= 0,
    },
    {
      title: "AVG ORDER VALUE",
      price: money(s?.avgOrderValue),
      rate: 0,
      isUp: true,
    },
  ];

  const exportChart = () => {
    const rows = [
      ["Period", "Revenue", "Orders"],
      ...(seriesRes?.data ?? []).map((p) => [p.period, p.revenue, p.orders]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: ColumnDef<IOrder>[] = [
    {
      header: "ORDER",
      accessorKey: "orderNumber",
      cell: ({ row }) => (
        <Typography variant="p-s" fontWeight="bold" className="font-mono">
          {row.original.orderNumber}
        </Typography>
      ),
    },
    {
      header: "CUSTOMER",
      accessorKey: "customer",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {customerName(row.original.customer)}
        </Typography>
      ),
    },
    {
      header: "TOTAL",
      accessorKey: "grandTotal",
      cell: ({ row }) => (
        <Typography variant="p-s" fontWeight="bold">
          {money(row.original.grandTotal)}
        </Typography>
      ),
    },
    {
      header: "PAYMENT",
      accessorKey: "paymentStatus",
      cell: ({ row }) => <Badge status={row.original.paymentStatus} />,
    },
    {
      header: "STATUS",
      accessorKey: "fulfillmentStatus",
      cell: ({ row }) => <Badge status={row.original.fulfillmentStatus} />,
    },
    {
      header: "",
      id: "action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            navigate(`${AuthRouteConfig.ORDERS}/${row.original._id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-9 p-1">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <Card key={`${card.title}-${idx}`} {...card} />
        ))}
      </section>

      <section className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-[2] h-[350px] bg-white border border-gray-200 p-4">
          <SalesChart
            data={chartData}
            title="Sales Report"
            periods={PERIODS.map((p) => p.label)}
            activePeriod={periodLabel}
            onPeriodChange={setPeriodLabel}
            onExport={exportChart}
          />
        </div>

        <aside className="flex-1 h-auto md:h-[350px] md:max-w-[349px] bg-white border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-gray-50">
            <Typography variant="h-s" fontWeight="bold">
              Top Products
            </Typography>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar">
            {topProducts.length === 0 ? (
              <Typography variant="p-s" color="N400" className="py-6 block">
                No sales in this period yet.
              </Typography>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={p.product}
                  className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="w-10 h-10 rounded bg-N10 overflow-hidden shrink-0">
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="p-s"
                      fontWeight="medium"
                      className="truncate"
                    >
                      {p.name}
                    </Typography>
                    <Typography variant="c-s" color="N400">
                      {p.unitsSold} sold
                    </Typography>
                  </div>
                  <Typography variant="p-s" fontWeight="bold">
                    {money(p.revenue)}
                  </Typography>
                  <span className="text-N300 text-xs">#{idx + 1}</span>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>

      <section className="w-full">
        <TMTable<IOrder>
          columns={columns}
          data={orders}
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
          loading={isFetching}
          className="bg-white overflow-hidden"
          headerClassName="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold"
        />
      </section>
    </div>
  );
};

export default Dashboard;
