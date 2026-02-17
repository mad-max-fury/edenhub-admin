import { Typography } from "@/components";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  name: string;
  value: number;
  year?: number | string;
}

interface SalesChartProps {
  data: SalesData[];
  title?: string;
  periods?: string[];
  activePeriod?: string;
  onPeriodChange?: (period: string) => void;
  onExport?: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="relative bg-white p-4 drop-shadow-2xl rounded-xl border border-gray-200 flex flex-col items-center gap-1 mb-4">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
          {label} {dataPoint.year || ""}
        </p>
        <p className="text-slate-900 text-lg font-bold">
          ${payload[0].value.toLocaleString()}
        </p>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  title = "Sales Report",
  periods = ["12 Months", "6 Months", "30 Days", "7 Days"],
  activePeriod = "12 Months",
  onPeriodChange,
  onExport,
}) => {
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="flex flex-wrap justify-between items-center gap-4 shrink-0 mb-6">
        <Typography variant={"h-s"} fontWeight={"bold"}>
          {title}
        </Typography>
        <button
          onClick={onExport}
          className="flex items-center md:hidden gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">Export PDF</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => onPeriodChange?.(period)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activePeriod === period
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={onExport}
            className="flex items-center mmd:hidden gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full  mmd:aspect-video">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
            className="outline-none border-none"
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-BR200)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-BR200)"
                  stopOpacity={0.005}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--color-N30)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-text-default)",
                fontSize: 12,
                fontWeight: 500,
              }}
              dy={15}
              padding={{ left: 5, right: 0 }}
            />

            <YAxis hide domain={["auto", "auto"]} />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--color-BR200)", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-BR200)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSales)"
              activeDot={{
                r: 6,
                strokeWidth: 4,
                stroke: "var(--color-N0)",
                fill: "var(--color-BR200)",
              }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
