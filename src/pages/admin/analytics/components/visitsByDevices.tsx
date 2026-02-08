import { Typography } from "@/components";

const DeviceStat = ({ label, percentage, trend, colorClass }: any) => (
  <div className="flex-1 flex flex-col border-r border-dashed border-N40 last:border-0 px-4 first:pl-0">
    <Typography variant="p-s" color="gray-normal" className="mb-1">
      {label}
    </Typography>
    <Typography variant="h-l" fontWeight="bold" className="mb-auto">
      {percentage}%
    </Typography>
    <div className="mt-8">
      <Typography variant="p-s" color={trend.includes("+") ? "G300" : "R300"}>
        {trend} {trend.includes("+") ? "↑" : "↓"}
      </Typography>
      <div className={`h-[10px] w-full rounded-full mt-2 ${colorClass}`} />
    </div>
  </div>
);

const VisitByDevice = () => {
  return (
    <div className="bg-white border border-gray-200 flex flex-col h-full">
      <div className=" px-4 py-4">
        <Typography variant="h-s" fontWeight="bold">
          Visit by Device
        </Typography>
        <Typography variant="p-s" color="gray-normal">
          Track user visits across devices for depth analytics
        </Typography>
      </div>

      <div className="py-4 border-y border-gray-200 mb-6 px-4">
        <div className="flex  h-max gap-2 w-full">
          <div className="w-1 h-[40px] bg-LB400 rounded-full" />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Typography variant="c-m">Total Page Visits</Typography>
              </div>
              <Typography variant="p-s" color="G300">
                + 36% ↑
              </Typography>
            </div>
            <Typography variant="p-m" color="gray-normal" className=" mb-1">
              All
            </Typography>
          </div>
        </div>
        <Typography variant="h-xl" fontWeight="medium">
          100,321,829
        </Typography>
      </div>

      <div className="flex h-full justify-between mt-auto px-5 pb-4">
        <DeviceStat
          label="Web"
          percentage={55}
          trend="+ 36%"
          colorClass="bg-P300"
        />
        <DeviceStat
          label="Phone"
          percentage={35}
          trend="+ 36%"
          colorClass="bg-LB400"
        />
        <DeviceStat
          label="Tablet"
          percentage={10}
          trend="- 14%"
          colorClass="bg-B100"
        />
      </div>
    </div>
  );
};

export default VisitByDevice;
