import { StorePerformanceChart } from "./components/storePerformance";
import { TopCountries } from "./components/topCountries";
import VisitByDevice from "./components/visitsByDevices";
import ConversionRateChart from "./components/convertionFunnel";
import {
  ActiveUserPerMin,
  ActiveVisitorsIcon,
  ConversionRateIcon,
} from "@/assets/svgs";
import StatCard from "./components/statCard";

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-9 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Visitors"
          value="157,367"
          trend="+ 6.7%"
          color="B50"
          icon={<ActiveVisitorsIcon className="h-full w-full" />}
        />
        <StatCard
          title="Visitor Per Minute"
          value="9,741"
          trend="- 13.5%"
          color="Y50"
          isDown
          icon={<ActiveUserPerMin className="h-full w-full" />}
        />
        <StatCard
          title="Conversion Rate"
          value="9.73%"
          trend="+ 3.5%"
          color="G50"
          icon={<ConversionRateIcon className="h-full w-full" />}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-[400px] md:h-[537px]">
          <StorePerformanceChart />
        </div>
        <div className="lg:col-span-5 h-[400px] md:h-[537px]">
          <VisitByDevice />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-[400px] md:h-[537px]">
          <ConversionRateChart />
        </div>
        <div className="lg:col-span-4 h-[450px] md:h-[537px]">
          <TopCountries />
        </div>
      </section>
    </div>
  );
};

export default Analytics;
