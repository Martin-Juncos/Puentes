import { ROLE_LABELS } from '@/constants/roles'
import { formatDate, formatDateTime } from '@/utils/formatters'

export const dashboardSectionOrder = [
  'agenda',
  'professionals',
  'children',
  'families',
  'services',
  'users',
]

export const buildDashboardSections = ({
  canViewUsers,
  children,
  families,
  professionals,
  services,
  summary,
  upcomingSessions,
  users,
  usersValue,
}) => ({
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
              `${assignment.professional.user.fullName}${
                assignment.service ? ` · ${assignment.service.name}` : ''
              }`,
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
        render: (row) =>
          row.children.map((child) => `${child.firstName} ${child.lastName}`).join(', ') ||
          'Sin registros',
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
    value: usersValue,
    description: 'Usuarios del sistema, con su rol actual y estado de acceso.',
    rows: users,
    emptyText: canViewUsers
      ? 'Todavía no hay usuarios registrados.'
      : 'Solo administración puede ver usuarios.',
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
})
