import { format } from "date-fns";
import { es } from "date-fns/locale";

import { DataTable } from "@/components/common/data-table";
import { Heading } from "@/components/common/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateClientTrigger } from "./_components/create-client-trigger";
import { getHourlyClients } from "@/actions/clients";
import { columns, HourlyClientColumns } from "./_components/columns";

export default async function HourlyClientsPage() {
  const clients = await getHourlyClients();

  const formattedClients: HourlyClientColumns[] = clients.map((client) => ({
    id: client.id,
    clientTypeId: client.clientType.id,
    vehicleTypeId: client.vehicleType.id,
    plate: client.plate,
    vehicleType: client.vehicleType.name,
    clientType: client.clientType.name,
    entryDate: format(client.entryDate!, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es }),
  }));

  return (
    <div className="space-y-6 xs:p-4">
      <Card className="dark:bg-muted/20 bg-muted-foreground/5">
        <CardHeader className="px-4 sm:p-6">
          <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
            <Heading
              title="Clientes Por Hora"
              description="Crea y gestiona de forma fácil tus clientes por hora."
            />
            <CreateClientTrigger />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:p-6">
          <DataTable
            searchKey="plate"
            searchPlaceholder="Buscar por placa..."
            columns={columns}
            data={formattedClients}
          />
        </CardContent>
      </Card>
    </div>
  );
}
