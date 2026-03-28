import { dateFnsLocalizer } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale/es'

const locales = {
  es,
}

export const calendarLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales,
})

export const calendarMessages = {
  today: 'Hoy',
  previous: 'Anterior',
  next: 'Siguiente',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Sesión',
  noEventsInRange: 'No hay sesiones en este rango.',
}
