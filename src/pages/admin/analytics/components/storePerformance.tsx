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
import { Typography } from "@/components";

const data = [
  { name: "Mon", views: 45, orders: 32, abandoned: 20, year: 2025, day: 20 },
  { name: "Tue", views: 52, orders: 38, abandoned: 25, year: 2025, day: 23 },
  { name: "Wed", views: 48, orders: 30, abandoned: 22, year: 2025, day: 21 },
  { name: "Thu", views: 61, orders: 45, abandoned: 30, year: 2025, day: 25 },
  { name: "Fri", views: 55, orders: 40, abandoned: 28, year: 2025, day: 24 },
  { name: "Sat", views: 67, orders: 48, abandoned: 35, year: 2025, day: 19 },
  { name: "Sun", views: 72, orders: 55, abandoned: 40, year: 2025, day: 15 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = `${label} ${payload[0].payload.day}, ${payload[0].payload.year}`;

    return (
      <div className="bg-white p-3 rounded-xl drop-shadow-2xl min-w-[160px] border border-gray-200">
        <Typography
          variant="p-s"
          className=" mb-2 block border-b border-N30 pb-1"
        >
          {date}
        </Typography>

        <div className="flex flex-col gap-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                {/* Color box matching the chart lines */}
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: entry.stroke || entry.color }}
                />
                <Typography variant="p-s" color="N400" className="capitalize">
                  {entry.dataKey === "views"
                    ? "Product Views"
                    : entry.dataKey === "orders"
                      ? "Product Orders"
                      : "Abandoned Cart"}
                </Typography>
              </div>
              <Typography variant="c-s" color="N500">
                {entry.value.toLocaleString()}
              </Typography>
            </div>
          ))}
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
      </div>
    );
  }
  return null;
};

export const StorePerformanceChart = () => (
  <div className="bg-white   border border-gray-200 w-full h-full flex flex-col">
    <div className=" p-4 flex justify-between items-start">
      <div>
        <Typography variant="h-s" fontWeight="bold" color="text-default">
          Store Performance
        </Typography>
        <Typography variant="p-s" color="gray-normal">
          Track the increase or decline in your store over time.
        </Typography>
      </div>
      <button className="px-4 py-2 border border-N30 rounded-lg text-c-s">
        Weekly
      </button>
    </div>

    <hr />

    <div className="flex-1 min-h-0 p-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-Y200)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-Y200)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-P200)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-P200)"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient id="colorAbandoned" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-B200)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-B200)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-N30)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--color-N100)",
              fontSize: 12,
              fontWeight: 400,
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--color-N100)",
              fontSize: 14,
              fontWeight: 400,
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--color-BR200)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="var(--color-Y200)"
            fillOpacity={1}
            fill="url(#colorViews)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="var(--color-P200)"
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
          <Area
            type="monotone"
            dataKey="abandoned"
            stroke="var(--color-B200)"
            fill="url(#colorAbandoned)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
