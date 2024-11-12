"use client";

import { ClientsCountByCategory, YearlyEarningsChartProps } from "@/types";
import { YearlyEarningsChart } from "./yearly-earnings-chart";
import { YearlyEarningsAreaChart } from "./yearly-earnings-area-chart";
import YearlyPieChart from "./yearly-pie-chart";

interface CurrentYearEarningsGraphsProps {
  yearEarnings: YearlyEarningsChartProps[];
  yearlyClientsByCategory: ClientsCountByCategory[];
}

export function CurrentYearEarningsGraphs({
  yearEarnings,
  yearlyClientsByCategory,
}: CurrentYearEarningsGraphsProps) {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <YearlyEarningsChart chartData={yearEarnings} />
      <div className="flex md:flex-wrap max-md:flex-col items-center gap-4">
        <YearlyEarningsAreaChart chartData={yearEarnings} />
        <YearlyPieChart
          yearlyClientsCountByCategory={yearlyClientsByCategory}
        />
      </div>
    </div>
  );
}
