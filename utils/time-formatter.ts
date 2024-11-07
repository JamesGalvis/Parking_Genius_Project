export function formatTime(time: Date) {
  return new Date(time).toLocaleTimeString("es-CO", {
    timeStyle: "short",
  })
}

// Función para obtener la fecha en la zona horaria especificada
export const getZonedDate = (date: Date, timeZone: string) => {
  const options = { timeZone, hour12: false };
  const parts = new Intl.DateTimeFormat("en-US", {
    ...options,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const dateParts = parts.reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  return new Date(
    `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}`
  );
};