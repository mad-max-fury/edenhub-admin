import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Button, Typography, SMSelectDropDown } from "@/components";
import Card from "@/components/Cards/Card";
import SalesChart from "../dashboard/components/salesReport/SalesReport";
import {
  useGetAnalyticsSummaryQuery,
  useGetSalesTimeseriesQuery,
  useGetTopProductsQuery,
  useGetSalesByCategoryQuery,
  type AnalyticsRange,
} from "@/redux/api/analytics";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 12 months", value: "12m" },
  { label: "All time", value: "all" },
];

const CHART_PERIODS: { label: string; value: AnalyticsRange }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "12M", value: "12m" },
  { label: "All", value: "all" },
];

const Analytics = () => {
  const [range, setRange] = useState<AnalyticsRange>("30d");

  const { data: summaryRes } = useGetAnalyticsSummaryQuery({ range });
  const { data: seriesRes } = useGetSalesTimeseriesQuery({ range });
  const { data: topRes } = useGetTopProductsQuery({ range, limit: 10 });
  const { data: catRes } = useGetSalesByCategoryQuery({ range });

  const s = summaryRes?.data;
  const series = seriesRes?.data ?? [];
  const topProducts = topRes?.data ?? [];
  const categories = catRes?.data ?? [];

  const chartData = useMemo(
    () => series.map((p) => ({ name: p.period, value: p.revenue })),
    [series],
  );

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
      title: "AVG ORDER VALUE",
      price: money(s?.avgOrderValue),
      rate: 0,
      isUp: true,
    },
    {
      title: "NEW CUSTOMERS",
      price: (s?.newCustomers ?? 0).toLocaleString(),
      rate: Math.round(Math.abs(s?.customersDelta ?? 0)),
      isUp: (s?.customersDelta ?? 0) >= 0,
    },
  ];

  const downloadReport = () => {
    const lines: string[][] = [];
    lines.push([
      "EdenHub Analytics Report",
      RANGES.find((r) => r.value === range)?.label ?? range,
    ]);
    lines.push([]);
    lines.push(["Metric", "Value"]);
    lines.push(["Revenue", String(s?.revenue ?? 0)]);
    lines.push(["Orders", String(s?.orders ?? 0)]);
    lines.push(["Avg order value", String(s?.avgOrderValue ?? 0)]);
    lines.push(["New customers", String(s?.newCustomers ?? 0)]);
    lines.push(["Total customers", String(s?.totalCustomers ?? 0)]);
    lines.push(["Active products", String(s?.totalProducts ?? 0)]);
    lines.push([]);
    lines.push(["Top Products", "Units Sold", "Revenue"]);
    topProducts.forEach((p) =>
      lines.push([p.name, String(p.unitsSold), String(p.revenue)]),
    );
    lines.push([]);
    lines.push(["Sales by Category", "Units", "Revenue"]);
    categories.forEach((c) =>
      lines.push([c.name, String(c.units), String(c.revenue)]),
    );
    lines.push([]);
    lines.push(["Revenue Timeline", "Period", "Revenue", "Orders"]);
    series.forEach((p) =>
      lines.push(["", p.period, String(p.revenue), String(p.orders)]),
    );

    const csv = lines
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `edenhub-analytics-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxCatRevenue = Math.max(1, ...categories.map((c) => c.revenue));

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Typography variant="h-m" fontWeight="bold">
            Analytics
          </Typography>
          <Typography variant="p-s" color="N500">
            Sales performance and product breakdown
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <SMSelectDropDown
              size="sm"
              options={RANGES}
              value={RANGES.find((r) => r.value === range) ?? null}
              onChange={(opt) => setRange(opt.value as AnalyticsRange)}
            />
          </div>
          <Button size="sm" onClick={downloadReport}>
            <div className="flex items-center gap-1.5">
              <Download size={14} /> Download report
            </div>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Card key={i} {...c} />
        ))}
      </section>

      {/* Revenue timeline */}
      <section className="bg-white border border-N30 rounded-lg p-4 h-[380px]">
        <SalesChart
          data={chartData}
          title="Revenue over time"
          periods={CHART_PERIODS.map((r) => r.label) ?? ""}
          activePeriod={CHART_PERIODS.find((r) => r.value === range)?.label}
          onPeriodChange={(opt) => {
            const val = CHART_PERIODS.find((r) => r.label === opt)?.value;
            setRange(val as AnalyticsRange);
          }}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by category */}
        <div className="bg-white border border-N30 rounded-lg p-5">
          <Typography variant="h-s" fontWeight="bold" className="mb-4">
            Sales by Category
          </Typography>
          {categories.length === 0 ? (
            <Typography variant="p-s" color="N400">
              No category sales in this period.
            </Typography>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map((c) => (
                <div key={c.category || c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-N600">{c.name}</span>
                    <span className="font-bold">{money(c.revenue)}</span>
                  </div>
                  <div className="h-2 bg-N20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-BR400"
                      style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products bar */}
        <div className="bg-white border border-N30 rounded-lg p-5">
          <Typography variant="h-s" fontWeight="bold" className="mb-4">
            Top Products by Revenue
          </Typography>
          {topProducts.length === 0 ? (
            <Typography variant="p-s" color="N400">
              No product sales in this period.
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={topProducts.slice(0, 6).map((p) => ({
                  name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
                  revenue: p.revenue,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number | undefined) => money(v)} />
                <Bar dataKey="revenue" fill="#74594D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Full breakdown table */}
      <section className="bg-white border border-N30 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-N20">
          <Typography variant="h-s" fontWeight="bold">
            Product Breakdown
          </Typography>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-N10 text-N500 text-left uppercase text-[11px]">
                <th className="px-5 py-3 font-bold">#</th>
                <th className="px-5 py-3 font-bold">Product</th>
                <th className="px-5 py-3 font-bold">Units Sold</th>
                <th className="px-5 py-3 font-bold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-N400">
                    No sales in this period.
                  </td>
                </tr>
              ) : (
                topProducts.map((p, i) => (
                  <tr key={p.product} className="border-b border-N20">
                    <td className="px-5 py-3 text-N400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-N10 overflow-hidden">
                          {p.image && (
                            <img
                              src={p.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td className="px-5 py-3">{p.unitsSold}</td>
                    <td className="px-5 py-3 font-bold">{money(p.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
