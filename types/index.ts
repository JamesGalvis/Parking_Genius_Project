export interface BreadcrumbType {
  href: string;
  label: string;
}

export interface HourlyClientEarningsConfig {
  earnings: {
    label: string;
  };
  hourlyClientsEarnings: {
    label: string;
    color: string;
  };
  monthlyClientsEarnings: {
    label: string;
    color: string;
  };
}

export interface MonthlyEarningsChartProps {
  day: string;
  hourlyClientsEarnings: number;
  monthlyClientsEarnings: number;
}

export interface YearlyEarningsChartProps {
  month: string;
  hourlyClientsEarnings: number;
  monthlyClientsEarnings: number;
}

export interface ClientsCountByCategory {
  category: string;
  count: number;
}

export interface ClientsCountByVehicleType {
  vehicleTypeName: string;
  count: number;
}

export interface ClientsCountByClientType {
  clientTypeName: string;
  count: number;
}
