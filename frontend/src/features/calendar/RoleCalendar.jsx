import { useState } from 'react'
import { Calendar } from 'react-big-calendar'

import { PanelCard } from '@/components/ui/PanelCard'

import { calendarLocalizer, calendarMessages } from './calendarLocalizer'
import { CalendarToolbar } from './CalendarToolbar'

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
    <PanelCard className="overflow-hidden bg-white/92 p-4">
      <Calendar
        components={{
          toolbar: CalendarToolbar,
        }}
        culture="es"
        date={currentDate}
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
        onNavigate={setCurrentDate}
        onView={setCurrentView}
        view={currentView}
        endAccessor="end"
        startAccessor="start"
        views={['month', 'week', 'day', 'agenda']}
      />
    </PanelCard>
  )
}
