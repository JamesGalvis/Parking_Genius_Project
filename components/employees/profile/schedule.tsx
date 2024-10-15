import { CalendarDays } from "lucide-react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { daysOfWeek, shifts } from "@/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTime } from "@/utils/time-formatter"

interface ShiftData {
  id: number
  dayOfWeek: number
  startTime: Date
  endTime: Date
}

export function Schedule() {
  const groupedShifts = shifts.reduce(
    (
      acc: { [key: string]: { morning: ShiftData[]; afternoon: ShiftData[] } },
      shift
    ) => {
      const day = daysOfWeek[shift.dayOfWeek]
      if (!acc[day]) {
        acc[day] = { morning: [], afternoon: [] }
      }

      // Consideramos turno de mañana si comienza antes de las 12:00
      if (shift.startTime.getHours() < 12) {
        acc[day].morning.push(shift)
      } else {
        acc[day].afternoon.push(shift)
      }

      return acc
    },
    {}
  )

  const renderShifts = (shifts: ShiftData[]) => {
    if (shifts.length === 0)
      return <span className="text-muted-foreground">Sin turno</span>
    return (
      <ul className="">
        {shifts.map((shift) => (
          <li key={shift.id}>
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </li>
        ))}
      </ul>
    )
  }

  const isRestDay = (day: string) => {
    return (
      !groupedShifts[day] ||
      (groupedShifts[day].morning.length === 0 &&
        groupedShifts[day].afternoon.length === 0)
    )
  }

  return (
    <Card className="border-none overflow-hidden bg-zinc-200/35 dark:bg-zinc-900 py-2">
      <CardHeader className="py-2 px-4 pt-4 pb-2 md:px-6 md:py-3">
        <CardTitle className="flex items-center gap-4">
          <CalendarDays className="size-8" /> Horario Semanal
        </CardTitle>
      </CardHeader>

      <CardContent className="py-3 px-4 md:px-6 overflow-hidden">
        <div className="w-full">
          <Table className="w-full min-w-[540px]">
            <TableCaption>Horario de trabajo semanal</TableCaption>
            <TableHeader className="hover:bg-muted-foreground/10">
              <TableRow>
                <TableHead className="w-[100px]">Día</TableHead>
                <TableHead>Mañana</TableHead>
                <TableHead>Tarde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daysOfWeek.map((day, index) => (
                <TableRow
                  key={day}
                  className={
                    isRestDay(day)
                      ? "opacity-50 bg-muted-foreground/10 dark:bg-muted hover:bg-muted-foreground/10"
                      : "hover:bg-muted-foreground/10"
                  }
                >
                  <TableCell className="font-medium">{day}</TableCell>
                  <TableCell>
                    {groupedShifts[day] ? (
                      renderShifts(groupedShifts[day].morning)
                    ) : (
                      <span className="text-muted-foreground">Descanso</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {groupedShifts[day] ? (
                      renderShifts(groupedShifts[day].afternoon)
                    ) : (
                      <span className="text-muted-foreground">Descanso</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// interface Turno {
//   inicio: string;
//   fin: string;
// }

// interface DiaLaboral {
//   dia: string;
//   turnos: Turno[];
// }

// export default function Schedule() {
//   const horarioSemanal: DiaLaboral[] = [
//     {
//       dia: "Lunes",
//       turnos: [
//         { inicio: "9:00 AM", fin: "1:00 PM" },
//         { inicio: "2:00 PM", fin: "6:00 PM" }
//       ]
//     },
//     {
//       dia: "Martes",
//       turnos: [
//         { inicio: "10:00 AM", fin: "7:00 PM" }
//       ]
//     },
//     {
//       dia: "Miércoles",
//       turnos: [
//         { inicio: "9:00 AM", fin: "1:00 PM" },
//         { inicio: "2:00 PM", fin: "5:00 PM" }
//       ]
//     },
//     {
//       dia: "Jueves",
//       turnos: [
//         { inicio: "9:00 AM", fin: "5:00 PM" }
//       ]
//     },
//     {
//       dia: "Viernes",
//       turnos: [
//         { inicio: "9:00 AM", fin: "1:00 PM" },
//         { inicio: "2:00 PM", fin: "6:00 PM" }
//       ]
//     },
//     {
//       dia: "Sábado",
//       turnos: [
//         { inicio: "10:00 AM", fin: "2:00 PM" }
//       ]
//     },
//     { dia: "Domingo", turnos: [] },
//   ]

//   return (
//     <div className="container mx-auto py-10">
//       <h2 className="text-2xl font-bold mb-4">Horario Semanal del Empleado</h2>
//       <Table>
//         <TableCaption>Horario de trabajo para la semana actual</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[100px]">Día</TableHead>
//             <TableHead>Turnos</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {horarioSemanal.map((dia) => (
//             <TableRow key={dia.dia}>
//               <TableCell className="font-medium">{dia.dia}</TableCell>
//               <TableCell>
//                 {dia.turnos.length > 0 ? (
//                   <ul className="list-disc list-inside">
//                     {dia.turnos.map((turno, index) => (
//                       <li key={index}>
//                         {turno.inicio} - {turno.fin}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span className="text-muted-foreground">Descanso</span>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }
