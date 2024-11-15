import { Heading } from "@/components/common/heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VehicleTypeConfig } from "./vehicle-type/vehicle-type-config";
import { ClientTypeConfig } from "./client-type/client-type-config";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FeeConfig } from "./fee/fee-config";

interface ConfigContentProps {
  disableFeeTab: boolean;
}

export default function ConfigContent({ disableFeeTab }: ConfigContentProps) {
  return (
    <>
      <Heading
        title="Configurar Parqueadero"
        description="Administra los tipos de vehículos y las tarifas para su parqueadero."
      />
      <Tabs defaultValue="vehicles">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="bg-transparent gap-2 mb-6 px-0 justify-start">
            <TabsTrigger
              className="data-[state=active]:bg-muted-foreground/15 hover:bg-muted/35"
              value="vehicles"
            >
              Tipos de Vehículos
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-muted-foreground/15 hover:bg-muted/35"
              value="clients"
            >
              Tipos de Clientes
            </TabsTrigger>
            <TabsTrigger
              disabled={disableFeeTab}
              className="data-[state=active]:bg-muted-foreground/15 hover:bg-muted/35"
              value="fees"
            >
              Tarifas
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="vehicles">
          <VehicleTypeConfig />
        </TabsContent>
        <TabsContent value="clients">
          <ClientTypeConfig />
        </TabsContent>
        <TabsContent value="fees">
          <FeeConfig />
        </TabsContent>
      </Tabs>
    </>
  );
}
