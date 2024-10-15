import {
  CircleUser,
  SquareUserRound,
  UsersRound,
  ChartColumnBig,
} from "lucide-react"

export const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/

export const employeeRoutes = [
  {
    label: "Mensuales",
    href: "/dashboard/monthly-clients",
    Icon: SquareUserRound,
  },
  {
    label: "Por fracción",
    href: "/dashboard/clients-per-fraction",
    Icon: UsersRound,
  },
]

export const adminRoutes = [
  {
    label: "Empleados",
    href: "/dashboard/employees",
    Icon: CircleUser,
  },
  {
    label: "Analíticas",
    href: "/dashboard/analytics",
    Icon: ChartColumnBig,
  },
]

export const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]

export const profileTabs: {
  value: string
  label: string
}[] = [
  {
    value: "general",
    label: "General",
  },
  {
    value: "password",
    label: "Contraseña",
  },
  {
    value: "schedule",
    label: "Horario",
  },
]

export const shifts: {
  id: number
  dayOfWeek: number
  startTime: Date
  endTime: Date
}[] = [
  // Lunes
  {
    id: 1,
    dayOfWeek: 0, // Lunes
    startTime: new Date(2024, 8, 16, 8, 0), // 16 de Septiembre de 2024, 8:00 AM
    endTime: new Date(2024, 8, 16, 12, 0), // 12:00 PM
  },
  {
    id: 2,
    dayOfWeek: 0,
    startTime: new Date(2024, 8, 16, 15, 0), // 3:00 PM
    endTime: new Date(2024, 8, 16, 20, 0), // 8:00 PM
  },

  // Martes
  {
    id: 3,
    dayOfWeek: 1, // Martes
    startTime: new Date(2024, 8, 17, 6, 0), // 6:00 AM
    endTime: new Date(2024, 8, 17, 10, 0), // 10:00 AM
  },
  {
    id: 4,
    dayOfWeek: 1,
    startTime: new Date(2024, 8, 17, 13, 0), // 1:00 PM
    endTime: new Date(2024, 8, 17, 17, 30), // 5:30 PM
  },

  // Miércoles (descanso)
  // No hay turnos el miércoles

  // Jueves
  {
    id: 5,
    dayOfWeek: 3, // Jueves
    startTime: new Date(2024, 8, 19, 7, 0), // 7:00 AM
    endTime: new Date(2024, 8, 19, 11, 0), // 11:00 AM
  },

  // Viernes
  {
    id: 6,
    dayOfWeek: 4, // Viernes
    startTime: new Date(2024, 8, 20, 9, 0), // 9:00 AM
    endTime: new Date(2024, 8, 20, 12, 0), // 12:00 PM
  },
  {
    id: 7,
    dayOfWeek: 4,
    startTime: new Date(2024, 8, 20, 14, 0), // 2:00 PM
    endTime: new Date(2024, 8, 20, 18, 0), // 6:00 PM
  },

  // Sábado
  {
    id: 8,
    dayOfWeek: 5, // Sábado
    startTime: new Date(2024, 8, 21, 8, 0), // 8:00 AM
    endTime: new Date(2024, 8, 21, 12, 0), // 12:00 PM
  },

  // Domingo (descanso)
  // No hay turnos el domingo
]
