const weekdayFormatter = new Intl.DateTimeFormat('es-AR', { weekday: 'short' })

const normalizeWeekday = (date) => {
  const rawValue = weekdayFormatter.format(date).replace('.', '').trim()
  return rawValue.charAt(0).toUpperCase() + rawValue.slice(1)
}

const isToday = (date) => {
  const now = new Date()

  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

export const CalendarDayHeader = ({ date }) => (
  <div className={`calendar-day-header${isToday(date) ? ' calendar-day-header--today' : ''}`}>
    <span className="calendar-day-header__weekday">{normalizeWeekday(date)}</span>
    <span className="calendar-day-header__date">{date.getDate()}</span>
  </div>
)
