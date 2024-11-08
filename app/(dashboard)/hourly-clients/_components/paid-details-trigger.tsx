"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CreditCard, Loader } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { HourlyClientColumns } from "./columns";
import { calculateTotalFee, getPaidDetails } from "@/actions/clients";
import { formatToCOP } from "@/utils/format-to-cop";
import { toast } from "sonner";

interface PaidDetailsTriggerProps {
  data: HourlyClientColumns;
}

export default function PaidDetailsTrigger({ data }: PaidDetailsTriggerProps) {
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [paidDetails, setPaidDetails] = useState<{
    stayDuration: string;
    totalAmount: number;
  }>();

  useEffect(() => {
    getPaidDetails(data).then((result) => setPaidDetails(result));
  }, [isOpen]);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await calculateTotalFee(data);

        if (error) {
          toast.error("Algo salió mal.", {
            description: error,
          });
        }

        if (success) {
          toast.success("Proceso completado.", {
            description: success,
          });
          setIsOpen(false);
        }
      } catch (error) {
        toast.error("Error", {
          description: "Algo salió mal en el proceso.",
        });
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Detalles de Pago</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de Pago</DialogTitle>
            <DialogDescription>
              Resumen de estancia en el parqueadero.
            </DialogDescription>
          </DialogHeader>
          {!paidDetails && (
            <div className="flex items-center justify-center py-3">
              <Loader className="size-5 animate-spin shrink-0" />
            </div>
          )}
          {paidDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right col-span-1">Vehículo:</span>
                <span className="font-semibold col-span-3 uppercase">
                  {data.plate}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right col-span-1">
                  <Clock className="inline-block mr-2" size={18} />
                </span>
                <span className="font-semibold col-span-3">
                  {paidDetails?.stayDuration}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right col-span-1">
                  <CreditCard className="inline-block mr-2" size={18} />
                </span>
                <span className="font-semibold col-span-3 text-lg text-primary">
                  {`${formatToCOP(paidDetails?.totalAmount!)} COP`}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={handleConfirm}
            >
              {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
