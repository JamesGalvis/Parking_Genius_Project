"use client"

import { useState, useTransition } from "react"
import {
  Trash2,
  Edit2,
  ArrowRight,
  Loader2,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  createCategory,
  createParkingLot,
  deleteCategory,
  updateCategory,
} from "@/actions/config"
import { VehicleCategory, ParkingLot as TypeParkingLot } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  rate: number
}

interface ParkingLot {
  name: string
  categories: Category[]
}

interface ParkingConfigStepperProps {
  vehicles: VehicleCategory[] | null
  existingParking: TypeParkingLot | null
}

export default function ParkingConfigStepper({
  vehicles,
  existingParking,
}: ParkingConfigStepperProps) {
  const [step, setStep] = useState(existingParking ? 2 : 1)
  const [isCreatingParking, startTransitionToCreate] = useTransition()

  const [parkingLot, setParkingLot] = useState<ParkingLot>({
    name: "",
    categories: [],
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    monthlyRate: 0,
    fractionalRate: 0,
  })
  const [isAddingCategory, startTransition] = useTransition()
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<VehicleCategory | null>(null)

  const addCategory = () => {
    if (
      newCategory.name.trim() === "" ||
      newCategory.monthlyRate < 0 ||
      newCategory.fractionalRate < 0
    ) {
      toast.error(
        "Por favor, ingrese un nombre válido y tarifas mayores o iguales a 0."
      )
      return
    }

    startTransition(async () => {
      try {
        const { error, success } = await createCategory(
          newCategory.name.trim(),
          newCategory.monthlyRate,
          newCategory.fractionalRate,
          existingParking?.id!
        )

        if (error) {
          toast.error(error)
        } else if (success) {
          toast.success(success)
          // Limpia los campos del formulario tras agregar la categoría
          setNewCategory({ name: "", monthlyRate: 0, fractionalRate: 0 })
        }
      } catch {
        toast.error("Hubo un error al agregar la categoría.")
      }
    })
  }

  const startEditingCategory = (category: VehicleCategory) => {
    setIsEditingCategory(true)
    setEditingCategory(category)
  }

  const saveEditedCategory = async () => {
    if (!editingCategory) return

    try {
      const { error, success } = await updateCategory(
        editingCategory.id,
        editingCategory.name,
        editingCategory.monthlyRate,
        editingCategory.fractionalRate
      )

      if (error) {
        toast.error(error)
      } else if (success) {
        toast.success(success)
        setIsEditingCategory(false)
        setEditingCategory(null) // Sale del modo de edición
      }
    } catch {
      toast.error("Hubo un error al editar la categoría.")
    }
  }

  const handleParkingLotNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParkingLot({ ...parkingLot, name: e.target.value })
  }

  const handleNextStep = () => {
    if (parkingLot.name.trim() === "" && step === 1) {
      toast.error("Por favor, ingrese un nombre para el parqueadero.")
      return
    } else if (parkingLot.name.trim() !== "" && step === 1) {
      startTransitionToCreate(async () => {
        try {
          const { error, success } = await createParkingLot(
            parkingLot.name.trim()
          )

          if (error) {
            toast.error(error)
          }

          if (success) {
            toast.success(success)
            setStep(2)
          }
        } catch {
          toast.error("Algo salió mal.")
        }
      })
    }
  }

  const deleteVehicleCategory = async (id: string) => {
    try {
      const { error, success } = await deleteCategory(id)

      if (error) {
        toast.error(error)
      }

      if (success) {
        toast.success(success)
      }
    } catch {
      toast.error("Algo salió mal al eliminar la categoría.")
    }
  }

  return (
    <>
      <Button
        className={cn(
          "absolute top-4 right-4",
          vehicles?.length === 0 && "hidden"
        )}
      >
        Ir al panel
      </Button>
      <Card className="w-full max-w-3xl mx-auto p-8 border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Configuración de Parqueadero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={step.toString()} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="1" disabled={step < 1}>
                Paso 1: Nombre del Parqueadero
              </TabsTrigger>
              <TabsTrigger value="2" disabled={step < 2}>
                Paso 2: Categorías y Tarifas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="1">
              <div className="text-end space-y-4 mt-12">
                <Input
                  variant="largeRounded"
                  placeholder="Nombre del Parqueadero"
                  value={parkingLot.name}
                  onChange={handleParkingLotNameChange}
                  className="w-full"
                />
                <Button
                  disabled={isCreatingParking}
                  onClick={handleNextStep}
                  className=" bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Siguiente{" "}
                  {!isCreatingParking ? (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  ) : (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="2">
              <div className="space-y-4 mt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Input
                      variant="largeRounded"
                      placeholder="Nombre de la categoría"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="flex-grow"
                    />
                    <div className="flex gap-4">
                      <Input
                        variant="largeRounded"
                        min={0}
                        type="number"
                        placeholder="Tarifa Mensual"
                        value={newCategory.monthlyRate || ""}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            monthlyRate: parseFloat(e.target.value),
                          })
                        }
                        className="w-32"
                      />
                      <Input
                        variant="largeRounded"
                        min={0}
                        type="number"
                        placeholder="Tarifa por Fracción"
                        value={newCategory.fractionalRate || ""}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            fractionalRate: parseFloat(e.target.value),
                          })
                        }
                        className="w-32"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addCategory}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={isAddingCategory}
                  >
                    <span>Agregar Categoría</span>
                    {isAddingCategory && (
                      <Loader2 className="size-4 ml-2 animate-spin" />
                    )}
                  </Button>
                </div>
                <Card className="">
                  <CardHeader>
                    <CardTitle>Categorías actuales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">
                            Categoría
                          </TableHead>
                          <TableHead className="text-center">
                            Tarifa Mensual
                          </TableHead>
                          <TableHead className="text-center">
                            Tarifa por Fracción
                          </TableHead>
                          <TableHead className="text-center">
                            Acciones
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicles?.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell className="text-center">
                              {editingCategory?.id === category.id ? (
                                <Input
                                  value={editingCategory.name}
                                  onChange={(e) =>
                                    setEditingCategory({
                                      ...editingCategory,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                category.name
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {editingCategory?.id === category.id ? (
                                <Input
                                  type="number"
                                  value={editingCategory.monthlyRate}
                                  onChange={(e) =>
                                    setEditingCategory({
                                      ...editingCategory,
                                      monthlyRate: parseFloat(e.target.value),
                                    })
                                  }
                                />
                              ) : (
                                `$${category.monthlyRate}`
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {editingCategory?.id === category.id ? (
                                <Input
                                  type="number"
                                  value={editingCategory.fractionalRate}
                                  onChange={(e) =>
                                    setEditingCategory({
                                      ...editingCategory,
                                      fractionalRate: parseFloat(
                                        e.target.value
                                      ),
                                    })
                                  }
                                />
                              ) : (
                                `$${category.fractionalRate}`
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {!isEditingCategory && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        startEditingCategory(category)
                                      }
                                    >
                                      <Edit2 className="mr-2 h-4 w-4" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteVehicleCategory(category.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />{" "}
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              {isEditingCategory && (
                                <Button onClick={() => saveEditedCategory()}>
                                  Guardar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {vehicles?.length === 0 && (
                          <p className="italic text-muted-foreground text-center p-4">
                            Sin categorias definidas aún
                          </p>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
