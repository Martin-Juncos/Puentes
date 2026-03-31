export const roles = {
  admin: 'ADMIN',
  coordination: 'COORDINATION',
  secretary: 'SECRETARY',
  professional: 'PROFESSIONAL',
}

export const INTERNAL_ROLES = Object.values(roles)

export const ROLE_CAPABILITIES = {
  ADMIN: [
    'users.manage',
    'roles.manage',
    'config.manage',
    'agenda.view.all',
    'agenda.manage',
    'records.manage',
  ],
  COORDINATION: [
    'agenda.view.all',
    'agenda.manage',
    'professionals.view',
    'services.manage',
    'records.view.global',
    'followups.view',
  ],
  SECRETARY: [
    'agenda.view.all',
    'agenda.manage',
    'children.manage',
    'families.manage',
    'attendance.manage',
    'payments.manage',
    'contacts.view',
  ],
  PROFESSIONAL: [
    'agenda.view.own',
    'agenda.manage.own',
    'children.view.assigned',
    'followups.manage.own',
  ],
}

export const getCapabilitiesForRole = (role) => ROLE_CAPABILITIES[role] ?? []
