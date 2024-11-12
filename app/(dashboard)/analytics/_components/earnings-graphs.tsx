"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrentMonthEarningsGraphs } from "./current-month-earnings-graphs";
import {
  ClientsCountByCategory,
  MonthlyEarningsChartProps,
  YearlyEarningsChartProps,
} from "@/types";
import { CurrentYearEarningsGraphs } from "./current-year-earnings-graphs";

interface EarningsGraphsProps {
  monthlyEarnings: MonthlyEarningsChartProps[];
  yearlyEarnings: YearlyEarningsChartProps[];
  monthlyClientsCountByCategory: ClientsCountByCategory[];
  yearlyClientsByCategory: ClientsCountByCategory[];
}

export function EarningsGraphs({
  monthlyEarnings,
  yearlyEarnings,
  monthlyClientsCountByCategory,
  yearlyClientsByCategory,
}: EarningsGraphsProps) {
  const [typeGraphs, setTypeGraphs] = useState("month");

  return (
    <div>
      <div className="flex items-center justify-end">
        <Select
          value={typeGraphs}
          onValueChange={(value) => setTypeGraphs(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mes actual</SelectItem>
            <SelectItem value="year">Año actual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-8">
        {typeGraphs === "month" && (
          <CurrentMonthEarningsGraphs
            monthlyEarnings={monthlyEarnings}
            monthlyClientsCountByCategory={monthlyClientsCountByCategory}
          />
        )}
        {typeGraphs === "year" && (
          <CurrentYearEarningsGraphs
            yearEarnings={yearlyEarnings}
            yearlyClientsByCategory={yearlyClientsByCategory}
          />
        )}
      </div>
    </div>
  );
}
