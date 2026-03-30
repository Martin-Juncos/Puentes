import { useState } from 'react'
import { Calendar } from 'react-big-calendar'

import { PanelCard } from '@/components/ui/PanelCard'

import { CalendarDayHeader } from './CalendarDayHeader'
import { calendarFormats, calendarLocalizer, calendarMessages } from './calendarLocalizer'
import { CalendarToolbar } from './CalendarToolbar'

const visibleDayStart = new Date(1970, 0, 1, 7, 0, 0)
const visibleDayEnd = new Date(1970, 0, 1, 22, 0, 0)
const initialScrollTime = new Date(1970, 0, 1, 7, 0, 0)

export const RoleCalendar = ({ sessions }) => {
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
        formats={calendarFormats}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.resource.professional.calendarColor || event.resource.service.colorTag || '#2F5D73',
            borderRadius: '14px',
            color: 'white',
            border: 'none',
            paddingInline: '4px',
          },
        })}
        events={events}
        localizer={calendarLocalizer}
        messages={calendarMessages}
        min={visibleDayStart}
        max={visibleDayEnd}
        onNavigate={setCurrentDate}
        onView={setCurrentView}
        scrollToTime={initialScrollTime}
        step={30}
        timeslots={2}
        view={currentView}
        endAccessor="end"
        startAccessor="start"
        views={['month', 'week', 'day', 'agenda']}
      />
    </PanelCard>
  )
}
