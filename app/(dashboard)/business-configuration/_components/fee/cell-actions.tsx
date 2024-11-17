"use client";

import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { FeeColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/common/alert-modal";
import { Modal } from "@/components/common/modal";
import {
  deleteFees,
  getClientTypes,
  getVehicleTypes,
} from "@/actions/business-config";
import { ClientType, VehicleType } from "@prisma/client";
import { AddFeeForm } from "./add-fee-form";

interface CellActionProps {
  data: FeeColumns;
}

export function CellAction({ data }: CellActionProps) {
  const [isLoading, startTransition] = useTransition();

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);

  const [openActions, setOpenActions] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);

  useEffect(() => {
    getVehicleTypes().then((result) => setVehicleTypes(result));
    getClientTypes().then((result) => setClientTypes(result));
  }, []);

  const closeDialog = () => {
    setOpen(false);
    setOpenActions(false);
  };

  const handleActionsOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteFees(data);

        if (error) {
          toast.error("Algo salió mal.", {
            description: error,
          });
        }

        if (success) {
          toast.success("Proceso completado.", {
            description: success,
          });
          setOpenAlertConfirmation(false);
        }
      } catch {
        toast.error("Error", {
          description: "Algo salió mal al eliminar las tarifas.",
        });
      }
    });
  };

  return (
    <>
      <AlertModal
        title="¿Está seguro de eliminar esta tarifa?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente la tarifa."
        isLoading={isLoading}
        isOpen={openAlertConfirmation}
        onClose={() => setOpenAlertConfirmation(false)}
        onConfirm={handleConfirm}
      />

      <Modal title="Editar tarifas" isOpen={open} onClose={closeDialog}>
        <AddFeeForm
          initialData={data}
          vehicleTypes={vehicleTypes}
          clientTypes={clientTypes}
          closeDialog={closeDialog}
        />
      </Modal>

      <div className="flex items-center gap-1 w-full justify-end">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Edit strokeWidth={2.5} className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group hover:bg-red-500"
          onClick={() => setOpenAlertConfirmation(true)}
        >
          <Trash2
            strokeWidth={2.5}
            className="size-5 text-red-400 group-hover:text-white"
          />
        </Button>
      </div>
    </>
  );
}
