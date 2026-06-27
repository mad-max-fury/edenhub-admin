import { useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Typography, SMSelectDropDown } from "@/components";
import {
  useGetProductAnalyticsQuery,
  type AnalyticsRange,
} from "@/redux/api/analytics";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "12 months", value: "12m" },
  { label: "All time", value: "all" },
];

const Tile = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-N30 rounded-lg p-3">
    <Typography variant="c-s" color="N400" className="uppercase">
      {label}
    </Typography>
    <Typography variant="h-s" fontWeight="bold">
      {value}
    </Typography>
  </div>
);

export const ProductAnalytics = ({ productId }: { productId: string }) => {
  const [range, setRange] = useState<AnalyticsRange>("12m");
  const { data } = useGetProductAnalyticsQuery({ id: productId, range });
  const a = data?.data;

  const chart = (a?.timeseries ?? []).map((t) => ({
    name: t.period,
    revenue: t.revenue,
  }));

  return (
    <div className="bg-white border border-N30 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 size={15} className="text-B400" />
          <Typography variant="h-s" fontWeight="bold">
            Analytics
          </Typography>
        </div>
        <div className="w-40">
          <SMSelectDropDown
            size="sm"
            options={RANGES}
            value={RANGES.find((r) => r.value === range) ?? null}
            onChange={(opt) => setRange(opt.value as AnalyticsRange)}
          />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Tile label="Units sold" value={(a?.unitsSold ?? 0).toLocaleString()} />
          <Tile label="Revenue" value={money(a?.revenue)} />
          <Tile label="Orders" value={(a?.orderCount ?? 0).toLocaleString()} />
          <Tile
            label="Avg rating"
            value={`${(a?.averageRating ?? 0).toFixed(1)} (${a?.totalReviews ?? 0})`}
          />
          <Tile label="In stock" value={`${a?.stock ?? 0} units`} />
          <Tile label="Lifetime sales" value={(a?.totalSales ?? 0).toLocaleString()} />
        </div>

        {chart.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="prodRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#74594D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#74594D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number | undefined) => money(v)} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#74594D"
                fill="url(#prodRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="p-s" color="N400" className="py-6 text-center block">
            No sales recorded for this product yet.
          </Typography>
        )}
      </div>
    </div>
  );
};
