import { redirect } from "next/navigation";

import { currentRole } from "@/lib/auth-user";
import { getClientTypes, getVehicleTypes } from "@/actions/business-config";
import ConfigContent from "./_components/config-content";

export default async function BusinessConfigurationPage() {
  const role = await currentRole();

  const clientTypes = await getClientTypes();
  const vehicleTypes = await getVehicleTypes();

  const isAdmin = role === "Admin" || role === "SuperAdmin";
  const disableFeeTab = clientTypes.length === 0 || vehicleTypes.length === 0;

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="xs:p-4 space-y-6">
      <ConfigContent disableFeeTab={disableFeeTab} />
    </div>
  );
}
