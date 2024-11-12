import { Heading } from "@/components/common/heading";
import {
  getClientsCountByCategoryMonth,
  getClientsCountByCategoryYear,
  getMonthlyEarnings,
  getYearlyEarnings,
} from "@/actions/analitycs";
import { EarningsGraphs } from "./_components/earnings-graphs";

export default async function AnalyticsPage() {
  const monthlyEarnings = await getMonthlyEarnings();
  const monthlyClientsByCategory = await getClientsCountByCategoryMonth();

  const yearlyEarnings = await getYearlyEarnings();
  const yearlyClientsByCategory = await getClientsCountByCategoryYear();

  return (
    <div className="space-y-6 xs:p-4">
      <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
        <Heading
          title="Panel de Analíticas"
          description="Comprende a fondo las estadísticas clave de tu negocio para tomar decisiones informadas."
        />
      </div>
      <EarningsGraphs
        monthlyEarnings={monthlyEarnings}
        monthlyClientsCountByCategory={monthlyClientsByCategory}
        yearlyEarnings={yearlyEarnings}
        yearlyClientsByCategory={yearlyClientsByCategory}
      />
    </div>
  );
}