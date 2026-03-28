import { useState } from 'react'

import { DataTable } from '@/components/ui/DataTable'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PanelCard } from '@/components/ui/PanelCard'
import { StatCard } from '@/components/ui/StatCard'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { dashboardService } from '@/services/dashboardService'
import { familiesService } from '@/services/familiesService'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'
import { usersService } from '@/services/usersService'
import { formatDate, formatDateTime } from '@/utils/formatters'

const sectionOrder = ['agenda', 'professionals', 'children', 'families', 'services', 'users']

export const DashboardPage = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('agenda')
  const { data, isLoading } = useAsyncData(() => dashboardService.getSummary(), [])
  const { data: children } = useAsyncData(() => childrenService.list(), [])
  const { data: families } = useAsyncData(() => familiesService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])
  const { data: services } = useAsyncData(() => servicesService.listManage(), [])
  const canViewUsers = user.role === 'ADMIN'
  const { data: users } = useAsyncData(() => (canViewUsers ? usersService.list() : Promise.resolve([])), [canViewUsers])
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

  const sections = {
    agenda: {
      key: 'agenda',
      label: 'Agenda',
      value: summary.sessions,
      description: 'Muestra la agenda inmediata y las próximas sesiones del centro.',
      rows: upcomingSessions,
      emptyText: 'No hay sesiones próximas para mostrar.',
      columns: [
        {
          key: 'child',
          label: 'Niño / niña',
          render: (row) => `${row.child.firstName} ${row.child.lastName}`,
        },
        {
          key: 'professional',
          label: 'Profesional',
          render: (row) => row.professional.user.fullName,
        },
        {
          key: 'service',
          label: 'Servicio',
          render: (row) => row.service.name,
        },
        {
          key: 'startsAt',
          label: 'Inicio',
          render: (row) => formatDateTime(row.startsAt),
        },
        {
          key: 'status',
          label: 'Estado',
        },
      ],
    },
    professionals: {
      key: 'professionals',
      label: 'Profesionales',
      value: summary.professionals,
      description: 'Lista operativa del equipo profesional con su disciplina y rol interno.',
      rows: professionals,
      emptyText: 'Todavía no hay perfiles profesionales registrados.',
      columns: [
        {
          key: 'name',
          label: 'Nombre',
          render: (row) => row.user.fullName,
        },
        { key: 'discipline', label: 'Disciplina' },
        {
          key: 'role',
          label: 'Rol',
          render: (row) => ROLE_LABELS[row.user.role] ?? row.user.role,
        },
        {
          key: 'highlighted',
          label: 'Visibilidad',
          render: (row) => (row.isHighlighted ? 'Destacado' : 'Solo interno'),
        },
      ],
    },
    children: {
      key: 'children',
      label: 'Niños',
      value: summary.children,
      description: 'Casos registrados con familia asociada y datos básicos del acompañamiento.',
      rows: children,
      emptyText: 'Todavía no hay niños registrados.',
      columns: [
        {
          key: 'name',
          label: 'Niño / niña',
          render: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          key: 'family',
          label: 'Familia',
          render: (row) => row.family.displayName,
        },
        {
          key: 'birthDate',
          label: 'Nacimiento',
          render: (row) => formatDate(row.birthDate),
        },
        {
          key: 'assignments',
          label: 'Asignaciones',
          render: (row) =>
            row.assignments
              .map((assignment) =>
                `${assignment.professional.user.fullName}${assignment.service ? ` · ${assignment.service.name}` : ''}`,
              )
              .join(', ') || 'Sin asignación',
        },
      ],
    },
    families: {
      key: 'families',
      label: 'Familias',
      value: summary.families,
      description: 'Base administrativa de familias y tutores para agenda, cobros y seguimiento.',
      rows: families,
      emptyText: 'Todavía no hay familias registradas.',
      columns: [
        { key: 'displayName', label: 'Familia' },
        { key: 'primaryContactName', label: 'Contacto principal' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'status', label: 'Estado' },
        {
          key: 'children',
          label: 'Niños',
          render: (row) => row.children.map((child) => `${child.firstName} ${child.lastName}`).join(', ') || 'Sin registros',
        },
      ],
    },
    services: {
      key: 'services',
      label: 'Servicios',
      value: summary.services,
      description: 'Servicios institucionales disponibles para la agenda y el trabajo interdisciplinario.',
      rows: services,
      emptyText: 'Todavía no hay servicios cargados.',
      columns: [
        { key: 'name', label: 'Servicio' },
        { key: 'description', label: 'Descripción' },
        {
          key: 'durationMinutes',
          label: 'Duración',
          render: (row) => `${row.durationMinutes} min`,
        },
        { key: 'status', label: 'Estado' },
      ],
    },
    users: {
      key: 'users',
      label: 'Usuarios',
      value: users.length,
      description: 'Usuarios del sistema, con su rol actual y estado de acceso.',
      rows: users,
      emptyText: canViewUsers ? 'Todavía no hay usuarios registrados.' : 'Solo administración puede ver usuarios.',
      columns: [
        { key: 'fullName', label: 'Nombre' },
        { key: 'email', label: 'Email' },
        {
          key: 'role',
          label: 'Rol',
          render: (row) => ROLE_LABELS[row.role] ?? row.role,
        },
        { key: 'status', label: 'Estado' },
        { key: 'phone', label: 'Teléfono' },
      ],
    },
  }

  const availableSections = sectionOrder.filter((key) => key !== 'users' || canViewUsers).map((key) => sections[key])
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
        <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">Detalle seleccionado</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{selectedSection.label}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(46,46,46,0.72)]">{selectedSection.description}</p>

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
