// "use client"

// import { AlertCircle, Loader2 } from "lucide-react"
// import { useState, useCallback, useEffect } from "react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// // import { deleteCode, linkCodeToParkingLot } from "@/actions/config"
// import { ParkingLot } from "@prisma/client"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface GeneradorCodigosProps {
//   parkingLot: ParkingLot
// }

// export default function GeneradorCodigos({
//   parkingLot,
// }: GeneradorCodigosProps) {
//   const [validezMinutos, setValidezMinutos] = useState(60)
//   const [codigoGenerado, setCodigoGenerado] = useState<string | null>(
//     parkingLot.linkCode
//   )
//   const [horaInvalidacion, setHoraInvalidacion] = useState<Date | null>(
//     parkingLot.codeValidationTime
//   )
//   const [codigoExpirado, setCodigoExpirado] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const generarCodigo = useCallback(() => {
//     return Math.random().toString(36).substring(2, 8).toUpperCase()
//   }, [])

//   const handleGenerarCodigo = useCallback(async () => {
//     setIsLoading(true)
//     const nuevoCodigo = generarCodigo()

//     const ahora = new Date()
//     const tiempoInvalidacion = new Date(
//       ahora.getTime() + validezMinutos * 60000
//     )

//     const { error, success } = await linkCodeToParkingLot(
//       parkingLot.id,
//       nuevoCodigo,
//       tiempoInvalidacion
//     )

//     if (error) {
//       toast.error(error)
//     }

//     if (success) {
//       toast.success(success)
//       setCodigoGenerado(nuevoCodigo)
//       setCodigoExpirado(false)
//       setIsLoading(false)
//       setHoraInvalidacion(tiempoInvalidacion)
//     }
//   }, [validezMinutos, generarCodigo])

//   // useEffect(() => {
//   //   let timeoutId: NodeJS.Timeout | null = null
//   //   if (horaInvalidacion) {
//   //     const tiempoRestante = horaInvalidacion.getTime() - Date.now()
//   //     timeoutId = setTimeout(() => {
//   //       setIsLoading(true)
//   //       setCodigoGenerado(null)
//   //       setHoraInvalidacion(null)
//   //     }, tiempoRestante)
//   //   }
//   //   return () => {
//   //     if (timeoutId) clearTimeout(timeoutId)
//   //   }
//   // }, [horaInvalidacion])

//   useEffect(() => {
//     if (parkingLot.codeValidationTime) {
//       const tiempoRestante =
//         parkingLot.codeValidationTime.getTime() - Date.now()

//       if (tiempoRestante <= 0) {
//         clearCode()
//       }
//     }

//     async function clearCode() {
//       try {
//         const { error, success } = await deleteCode(parkingLot.id)

//         if (error) {
//           toast.error(error)
//         }

//         if (success) {
//           setCodigoGenerado(null)
//           setHoraInvalidacion(null)
//         }
//       } catch {
//         toast.error("Algo salió mal.")
//       }
//     }
//   }, [])

//   const formatearHora = (fecha: Date) => {
//     return fecha.toLocaleTimeString("es-ES", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     })
//   }

//   return (
//     <Card className="border-none overflow-hidden bg-zinc-200/35 dark:bg-zinc-900 py-2">
//       <CardHeader className="py-2 px-4 pt-4 pb-2 md:px-6 md:py-3">
//         <CardTitle className="flex items-center gap-4">
//           Código de vinculación
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="validezMinutos">Tiempo de validez (minutos)</Label>
//             <Input
//               id="validezMinutos"
//               type="number"
//               min="1"
//               value={validezMinutos}
//               onChange={(e) =>
//                 setValidezMinutos(Math.max(1, parseInt(e.target.value)))
//               }
//             />
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter className="flex flex-col items-stretch space-y-4">
//         <Button disabled={isLoading} onClick={handleGenerarCodigo} className="w-full">
//           <Loader2 className={cn("mr-2 animate-spin size-4", !isLoading && "hidden")} /> Generar Código
//         </Button>
//         {codigoGenerado && horaInvalidacion && (
//           <div className="border rounded p-4 mt-4">
//             <h3 className="font-semibold mb-2">
//               Código generado (válido por {validezMinutos}{" "}
//               {validezMinutos === 1 ? "minuto" : "minutos"}):
//             </h3>
//             <div className="text-lg font-bold mb-2">{codigoGenerado}</div>
//             <div className="text-sm text-muted-foreground">
//               Se invalida a las: {formatearHora(horaInvalidacion)}
//             </div>
//           </div>
//         )}
//         {codigoExpirado && (
//           <div
//             className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
//             role="alert"
//           >
//             <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
//             <span className="sr-only">Info</span>
//             <div>
//               <span className="font-medium">El código ha expirado.</span> Por
//               favor, genera un nuevo código.
//             </div>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   )
// }
