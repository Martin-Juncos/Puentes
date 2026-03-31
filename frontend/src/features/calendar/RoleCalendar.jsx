import { useState } from 'react'
import { Calendar } from 'react-big-calendar'

import { PanelCard } from '@/components/ui/PanelCard'

import { CalendarDayHeader } from './CalendarDayHeader'
import { calendarFormats, calendarLocalizer, calendarMessages } from './calendarLocalizer'
import { CalendarToolbar } from './CalendarToolbar'

const visibleDayStart = new Date(1970, 0, 1, 7, 0, 0)
const visibleDayEnd = new Date(1970, 0, 1, 22, 0, 0)
const initialScrollTime = new Date(1970, 0, 1, 7, 0, 0)

export const RoleCalendar = ({
  sessions,
  selectedSessionId = '',
  canSelectSlot = false,
  onSelectSession,
  onSelectSlot,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('week')

  const events = sessions.map((session) => ({
    id: session.id,
    title: `${session.child.firstName} ${session.child.lastName} · ${session.service.name}`,
    start: new Date(session.startsAt),
    end: new Date(session.endsAt),
    resource: session,
  }))

  return (
    <PanelCard className="overflow-hidden bg-white/92 p-4" variant="form">
      <Calendar
        components={{
          toolbar: CalendarToolbar,
          header: CalendarDayHeader,
        }}
        culture="es"
        date={currentDate}
        endAccessor="end"
        eventPropGetter={(event) => {
          const isSelected = event.id === selectedSessionId

          return {
            style: {
              backgroundColor:
                event.resource.professional.calendarColor || event.resource.service.colorTag || '#2F5D73',
              borderRadius: '14px',
              color: 'white',
              border: isSelected ? '2px solid rgba(255,255,255,0.92)' : 'none',
              boxShadow: isSelected ? '0 0 0 2px rgba(47,93,115,0.24)' : 'none',
              paddingInline: '4px',
            },
          }
        }}
        events={events}
        formats={calendarFormats}
        localizer={calendarLocalizer}
        max={visibleDayEnd}
        messages={calendarMessages}
        min={visibleDayStart}
        onNavigate={setCurrentDate}
        onSelectEvent={(event) => onSelectSession?.(event.resource)}
        onSelectSlot={(slotInfo) => onSelectSlot?.(slotInfo)}
        onView={setCurrentView}
        scrollToTime={initialScrollTime}
        selectable={canSelectSlot ? 'ignoreEvents' : false}
        startAccessor="start"
        step={30}
        timeslots={2}
        view={currentView}
        views={['month', 'week', 'day', 'agenda']}
      />
    </PanelCard>
  )
}
