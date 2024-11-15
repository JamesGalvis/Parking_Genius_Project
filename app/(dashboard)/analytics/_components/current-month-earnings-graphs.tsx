"use client";

import {
  ClientsCountByCategory,
  ClientsCountByClientType,
  ClientsCountByVehicleType,
  MonthlyEarningsChartProps,
} from "@/types";
import { MonthlyEarningsChart } from "./monthly-earnings-chart";
import MonthlyPieChart from "./monthly-pie-chart";
import { MonthlyEarningsAreaChart } from "./monthly-earnings-area-chart";

interface CurrentMonthEarningsGraphsProps {
  monthlyEarnings: MonthlyEarningsChartProps[];
  monthlyClientsCountByCategory: ClientsCountByCategory[];
}

export function CurrentMonthEarningsGraphs({
  monthlyEarnings,
  monthlyClientsCountByCategory,
}: CurrentMonthEarningsGraphsProps) {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <MonthlyEarningsChart chartData={monthlyEarnings} />
      <div className="flex md:flex-wrap max-md:flex-col items-center gap-4">
        <MonthlyEarningsAreaChart chartData={monthlyEarnings} />
        {monthlyClientsCountByCategory.length > 0 && <MonthlyPieChart
          monthlyClientsCountByCategory={monthlyClientsCountByCategory}
        />}
      </div>
    </div>
  );
}
