import { useState } from 'react'

import { PageHeader } from '@/components/private/PageHeader'
import { Alert } from '@/components/ui/Alert'
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

const resolveVisibleCount = ({ apiValue, error, isSectionLoading, rows }) => {
  if (error) {
    return 'N/D'
  }

  if (isSectionLoading) {
    return apiValue ?? '...'
  }

  return rows.length
}

export const DashboardPage = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('agenda')
  const {
    data,
    isLoading,
    error: dashboardError,
  } = useAsyncData(() => dashboardService.getSummary(), [])
  const {
    data: children,
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useAsyncData(() => childrenService.list(), [])
  const {
    data: families,
    isLoading: isFamiliesLoading,
    error: familiesError,
  } = useAsyncData(() => familiesService.list(), [])
  const {
    data: professionals,
    isLoading: isProfessionalsLoading,
    error: professionalsError,
  } = useAsyncData(() => professionalsService.listManage(), [])
  const {
    data: services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useAsyncData(() => servicesService.listManage(), [])
  const canViewUsers = user.role === 'ADMIN'
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useAsyncData(
    () => (canViewUsers ? usersService.list() : Promise.resolve([])),
    [canViewUsers],
  )

  const upcomingSessions = data?.upcomingSessions ?? []
  const apiSummary = data?.summary ?? {}
  const summary = {
    children: resolveVisibleCount({
      apiValue: apiSummary.children,
      error: childrenError,
      isSectionLoading: isChildrenLoading,
      rows: children,
    }),
    families: resolveVisibleCount({
      apiValue: apiSummary.families,
      error: familiesError,
      isSectionLoading: isFamiliesLoading,
      rows: families,
    }),
    professionals: resolveVisibleCount({
      apiValue: apiSummary.professionals,
      error: professionalsError,
      isSectionLoading: isProfessionalsLoading,
      rows: professionals,
    }),
    services: resolveVisibleCount({
      apiValue: apiSummary.services,
      error: servicesError,
      isSectionLoading: isServicesLoading,
      rows: services,
    }),
    sessions: dashboardError ? 'N/D' : apiSummary.sessions ?? upcomingSessions.length,
    pendingPayments: dashboardError ? 'N/D' : apiSummary.pendingPayments ?? 0,
    openContacts: dashboardError ? 'N/D' : apiSummary.openContacts ?? 0,
  }

  const hasLoadErrors = Boolean(
    dashboardError ||
      childrenError ||
      familiesError ||
      professionalsError ||
      servicesError ||
      usersError,
  )
  const usersValue = !canViewUsers ? 0 : usersError ? 'N/D' : isUsersLoading ? '...' : users.length

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
    usersValue,
  })

  const availableSections = dashboardSectionOrder
    .filter((key) => key !== 'users' || canViewUsers)
    .map((key) => sections[key])
  const selectedSection = sections[activeSection] ?? sections.agenda

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Elegi un bloque del resumen para ampliar el detalle sin salir de la vista operativa general."
        eyebrow="Resumen operativo"
        title="Estado general del centro"
      />

      {hasLoadErrors ? (
        <Alert title="No pudimos cargar todo el resumen operativo" tone="warning">
          Algunas metricas del panel no respondieron y por eso pueden verse como `N/D` o con menos detalle del
          esperado. Si esto pasa solo en produccion, revisa la sesion y la configuracion de la cookie segura del
          backend.
        </Alert>
      ) : null}

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

      <PanelCard variant="form">
        <p className="eyebrow-label">Detalle seleccionado</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{selectedSection.label}</h2>
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
