import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { Typography } from "@/components";

const data = [
  { stage: "Product views", value: 10290, trend: "+ 36%" },
  { stage: "Add to Cart", value: 4539, trend: "+ 36%" },
  { stage: "Proceed to Checkout", value: 2539, trend: "+ 36%" },
  { stage: "Completed Purchase", value: 3539, trend: "+ 36%" },
  { stage: "Abandoned Cart", value: 1539, trend: "+ 36%" },
];

const COLORS = [
  "var(--color-BR50)",
  "var(--color-BR75)",
  "var(--color-BR100)",
  "var(--color-BR200)",
  "var(--color-BR300)",
];

const ConversionRateChart = () => {
  return (
    <div className="bg-white border border-gray-200 w-full h-full flex flex-col overflow-hidden ">
      <div className="p-4 flex justify-between items-start shrink-0">
        <div>
          <Typography variant="h-s" fontWeight="bold">
            Conversion Rate
          </Typography>
          <Typography variant="p-s" color="gray-normal">
            Track how users interacted with products in your store over time.
          </Typography>
        </div>
        <button className="px-4 py-2 border border-N30 rounded-lg text-c-s whitespace-nowrap">
          Weekly
        </button>
      </div>

      <hr className="border-gray-100" />

      <div className="flex-1 w-full min-h-0 relative flex flex-col p-4">
        <div className="flex z-10 pointer-events-none w-full h-full absolute inset-0 px-2 sm:px-4 pt-4">
          {data.map((item, idx) => (
            <div
              key={`label-${idx}`}
              className={`flex-1 flex flex-col items-start px-1 sm:px-4 
                ${idx !== 0 ? "border-l border-dashed border-N40 ml-[-1px]" : ""}
              `}
            >
              <Typography
                variant="p-s"
                color="gray-normal"
                className="leading-tight text-[9px] sm:text-[10px] font-medium uppercase tracking-wider min-h-[32px] sm:min-h-[40px] break-words"
              >
                {item.stage}
              </Typography>

              <Typography
                variant="h-l"
                fontWeight="bold"
                className="mt-1 text-[10px] xs:text-sm sm:text-base md:text-xl"
              >
                {item.value.toLocaleString()}
              </Typography>

              <Typography
                variant="p-s"
                className="mt-1 sm:mt-6 font-medium text-[8px] sm:text-xs"
                color="G300"
              >
                {item.trend} ↑
              </Typography>
            </div>
          ))}
        </div>

        <div className="w-full h-full mt-auto pt-20 sm:pt-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barGap={0}
            >
              <Bar dataKey="value" radius={[16, 16, 0, 0]} minPointSize={5}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
              <XAxis hide />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ConversionRateChart;
