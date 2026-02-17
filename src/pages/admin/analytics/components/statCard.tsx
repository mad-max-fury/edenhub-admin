import { Typography } from "@/components";

const StatCard = ({ title, value, trend, color, isDown, icon }: any) => (
  <div className="bg-white p-6  border border-gray-200 flex justify-between items-start ">
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 flex flex-col gap-2">
          <Typography
            variant="h-xs"
            color="gray-normal"
            className="uppercase tracking-wider"
          >
            {title}
          </Typography>
          <Typography variant="h-l" color="text-default">
            {value}
          </Typography>
        </div>
        <div className="h-[60px] aspect-square">{icon}</div>
      </div>
      <Typography variant="p-s" color={isDown ? "R300" : "G300"}>
        {isDown ? "↓" : "↑"} {trend} {isDown ? "Decrease" : "Increase"}
      </Typography>
    </div>
  </div>
);
export default StatCard;
