import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'

const viewButtons = [
  { value: 'month', label: 'Mes', icon: FiCalendar },
  { value: 'week', label: 'Semana', icon: FiCalendar },
  { value: 'day', label: 'Día', icon: FiClock },
  { value: 'agenda', label: 'Agenda', icon: FiClock },
]

export const CalendarToolbar = ({ label, onNavigate, onView, view }) => (
  <div className="mb-5 flex flex-col gap-4 border-b border-[rgba(47,93,115,0.1)] pb-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">Vista actual</p>
      <h3 className="mt-2 text-xl font-semibold text-[var(--color-primary)]">{label}</h3>
    </div>

    <div className="flex flex-col gap-3 lg:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <Button className="gap-2 px-4 py-2.5" onClick={() => onNavigate('TODAY')} type="button" variant="outline">
          Hoy
        </Button>
        <Button className="gap-2 px-4 py-2.5" onClick={() => onNavigate('PREV')} type="button" variant="ghost">
          <FiChevronLeft aria-hidden="true" className="size-4" />
          Anterior
        </Button>
        <Button className="gap-2 px-4 py-2.5" onClick={() => onNavigate('NEXT')} type="button" variant="ghost">
          Siguiente
          <FiChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {viewButtons.map((item) => {
          const Icon = item.icon

          return (
            <Button
              className="gap-2 px-4 py-2.5"
              key={item.value}
              onClick={() => onView(item.value)}
              type="button"
              variant={view === item.value ? 'primary' : 'outline'}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </Button>
          )
        })}
      </div>
    </div>
  </div>
)
