import { getParkingLotByUser, getVehicles } from "@/actions/config"
import ParkingConfigStepper from "@/components/dashboard/config/parking-config-stepper"

export default async function ConfigPage() {
  const existingParkingLot = await getParkingLotByUser()
  const existingVehicles = await getVehicles()

  return (
    <div className="min-h-full flex items-center justify-center py-5 overflow-y-auto">
      <ParkingConfigStepper
        vehicles={existingVehicles}
        existingParking={existingParkingLot}
      />
    </div>
  )
}
