export function formatTime(time: Date) {
  return new Date(time).toLocaleTimeString("es-CO", {
    timeStyle: "short",
  })
}
