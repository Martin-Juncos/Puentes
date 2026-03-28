import {
  FiActivity,
  FiCalendar,
  FiClipboard,
  FiCreditCard,
  FiGrid,
  FiLayers,
  FiSettings,
  FiShield,
  FiUser,
  FiUsers,
} from 'react-icons/fi'

export const publicNavigation = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre-puentes', label: 'Sobre Puentes' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/equipo', label: 'Equipo' },
  { to: '/acompanamiento', label: 'Acompañamiento' },
  { to: '/contacto', label: 'Contacto' },
]

export const privateNavigation = [
  {
    to: '/app/dashboard',
    label: 'Resumen',
    icon: FiGrid,
    roles: ['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'],
  },
  {
    to: '/app/agenda',
    label: 'Agenda',
    icon: FiCalendar,
    roles: ['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'],
  },
  {
    to: '/app/familias',
    label: 'Familias',
    icon: FiUsers,
    roles: ['ADMIN', 'COORDINATION', 'SECRETARY'],
  },
  {
    to: '/app/ninos',
    label: 'Niños',
    icon: FiUser,
    roles: ['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'],
  },
  {
    to: '/app/profesionales',
    label: 'Profesionales',
    icon: FiActivity,
    roles: ['ADMIN', 'COORDINATION', 'SECRETARY'],
  },
  {
    to: '/app/servicios',
    label: 'Servicios',
    icon: FiLayers,
    roles: ['ADMIN', 'COORDINATION', 'SECRETARY'],
  },
  {
    to: '/app/cobros',
    label: 'Cobros y asistencia',
    icon: FiCreditCard,
    roles: ['COORDINATION', 'SECRETARY'],
  },
  {
    to: '/app/seguimientos',
    label: 'Seguimientos',
    icon: FiClipboard,
    roles: ['COORDINATION', 'PROFESSIONAL'],
  },
  {
    to: '/app/usuarios',
    label: 'Usuarios',
    icon: FiShield,
    roles: ['ADMIN'],
  },
  {
    to: '/app/configuracion',
    label: 'Configuración',
    icon: FiSettings,
    roles: ['ADMIN'],
  },
]
