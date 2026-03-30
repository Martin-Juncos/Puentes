import { useState } from 'react'

import { DataTable } from '@/components/ui/DataTable'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PanelCard } from '@/components/ui/PanelCard'
import { StatCard } from '@/components/ui/StatCard'
import { buildDashboardSections, dashboardSectionOrder } from '@/features/dashboard/dashboardSections'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { dashboardService } from '@/services/dashboardService'
import { familiesService } from '@/services/familiesService'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'
import { usersService } from '@/services/usersService'

export const DashboardPage = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('agenda')
  const { data, isLoading } = useAsyncData(() => dashboardService.getSummary(), [])
  const { data: children } = useAsyncData(() => childrenService.list(), [])
  const { data: families } = useAsyncData(() => familiesService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])
  const { data: services } = useAsyncData(() => servicesService.listManage(), [])
  const canViewUsers = user.role === 'ADMIN'
  const { data: users } = useAsyncData(
    () => (canViewUsers ? usersService.list() : Promise.resolve([])),
    [canViewUsers],
  )

  const summary = data.summary ?? {
    children: 0,
    families: 0,
    professionals: 0,
    services: 0,
    sessions: 0,
    pendingPayments: 0,
    openContacts: 0,
  }
  const upcomingSessions = data.upcomingSessions ?? []

  if (isLoading) {
    return <LoadingScreen message="Cargando resumen operativo..." />
  }

  const sections = buildDashboardSections({
    canViewUsers,
    children,
    families,
    professionals,
    services,
    summary,
    upcomingSessions,
    users,
  })

  const availableSections = dashboardSectionOrder
    .filter((key) => key !== 'users' || canViewUsers)
    .map((key) => sections[key])
  const selectedSection = sections[activeSection] ?? sections.agenda

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {availableSections.map((section, index) => (
          <StatCard
            accent={index === 0 && activeSection === section.key}
            key={section.key}
            label={section.label}
            onClick={() => setActiveSection(section.key)}
            selected={activeSection === section.key}
            value={section.value}
          />
        ))}
      </div>

      <PanelCard>
        <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">
          Detalle seleccionado
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
          {selectedSection.label}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(46,46,46,0.72)]">
          {selectedSection.description}
        </p>

        <div className="mt-6">
          <DataTable
            columns={selectedSection.columns}
            emptyText={selectedSection.emptyText}
            rows={selectedSection.rows}
          />
        </div>
      </PanelCard>
    </div>
  )
}
