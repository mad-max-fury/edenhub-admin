import { Typography } from "@/components";

const countries = [
  { name: "United Kingdom", value: 132, percent: 90 },
  { name: "India", value: 64, percent: 60 },
  { name: "Nepal", value: 44, percent: 45 },
  { name: "Egypt", value: 40, percent: 40 },
  { name: "France", value: 64, percent: 60 },
  { name: "Nigeria", value: 44, percent: 45 },
  { name: "China", value: 40, percent: 40 },
  { name: "Others", value: 40, percent: 40 },
];

export const TopCountries = () => (
  <div className="bg-white   border border-gray-200 w-full h-full flex flex-col">
    <div className=" p-4 flex flex-col justify-between items-start">
      <Typography variant="h-s" fontWeight="bold" color="text-default">
        Top Countries
      </Typography>
      <Typography variant="p-s" color="gray-normal">
        Track countries using your store over time.
      </Typography>
    </div>

    <hr />
    <div className="space-y-6 pt-6 pb-5 p-4 overflow-auto">
      {countries.map((c) => (
        <div key={c.name} className="space-y-2">
          <div className="flex justify-between">
            <Typography variant="p-s" color="text-default">
              {c.name}
            </Typography>
            <Typography variant="c-s">{c.value}</Typography>
          </div>
          <div className="w-full bg-N20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-BR300 h-full rounded-full transition-all duration-1000"
              style={{ width: `${c.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
