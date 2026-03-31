import { FiCalendar } from 'react-icons/fi'

import { PanelAccessNotice } from '@/components/private/PanelAccessNotice'
import { PanelSectionHeader } from '@/components/private/PanelSectionHeader'
import { SelectionStateCard } from '@/components/private/SelectionStateCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PanelCard } from '@/components/ui/PanelCard'
import { formatDateTime } from '@/utils/formatters'

import {
  getSessionScheduleLabel,
  getSessionTitle,
  renderSessionStatusBadge,
} from './sessionAgendaUtils'

export const AgendaReadOnlyPanel = ({ session }) => (
  <PanelCard>
    <PanelSectionHeader
      description="Seleccioná una sesión para revisar su información operativa. No incluye notas administrativas ni herramientas de edición."
      icon={FiCalendar}
      title="Detalle de la sesión"
    />

    {!session ? (
      <EmptyState
        description="Cuando tengas sesiones asignadas, vas a poder revisarlas en detalle desde esta tarjeta."
        title="Todavía no hay una sesión seleccionada"
      />
    ) : (
      <div className="mt-6 grid gap-4">
        <SelectionStateCard
          lines={[
            `Horario: ${getSessionScheduleLabel(session)}`,
            `Servicio: ${session.service.name}`,
            `Profesional: ${session.professional.user.fullName}`,
          ]}
          title={getSessionTitle(session)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)]">
              Estado
            </p>
            <div className="mt-3">{renderSessionStatusBadge(session.status)}</div>
          </div>

          <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)]">
              Servicio
            </p>
            <p className="mt-3 font-semibold text-[var(--color-primary)]">{session.service.name}</p>
          </div>

          <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)]">
              Inicio
            </p>
            <p className="mt-3 font-semibold text-[var(--color-primary)]">{formatDateTime(session.startsAt)}</p>
          </div>

          <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)]">
              Fin
            </p>
            <p className="mt-3 font-semibold text-[var(--color-primary)]">{formatDateTime(session.endsAt)}</p>
          </div>
        </div>

        <PanelAccessNotice>
          Esta agenda es de consulta para profesionales. Si necesitás reprogramar, cancelar o crear una nueva sesión,
          coordiná la acción con secretaría, coordinación o administración.
        </PanelAccessNotice>
      </div>
    )}
  </PanelCard>
)
