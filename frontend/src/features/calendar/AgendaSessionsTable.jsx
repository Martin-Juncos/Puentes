import { useMemo } from 'react'

import { PanelTableHeader } from '@/components/private/PanelTableHeader'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { PanelCard } from '@/components/ui/PanelCard'
import { formatDateTime } from '@/utils/formatters'

import {
  formatTime,
  getSessionTitle,
  renderSessionStatusBadge,
} from './sessionAgendaUtils'

export const AgendaSessionsTable = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  canManageAgenda,
  title,
  description,
  countLabel = `${sessions.length} sesiones`,
}) => {
  const sessionColumns = useMemo(
    () => [
      {
        key: 'child',
        label: 'Niño o niña',
        render: (row) => getSessionTitle(row),
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
        key: 'schedule',
        label: 'Horario',
        render: (row) => (
          <div className="grid gap-1">
            <p className="font-medium text-[var(--color-primary)]">{formatDateTime(row.startsAt)}</p>
            <p className="text-xs text-[var(--color-text-soft)]">Hasta {formatTime(row.endsAt)}</p>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Estado',
        render: (row) => renderSessionStatusBadge(row.status),
      },
      {
        key: 'action',
        label: canManageAgenda ? 'Acción' : 'Detalle',
        render: (row) => (
          <Button
            className="px-3 py-2 text-xs"
            onClick={(event) => {
              event.stopPropagation()
              onSelectSession(row)
            }}
            type="button"
            variant="outline"
          >
            {selectedSessionId === row.id ? 'Seleccionada' : canManageAgenda ? 'Editar' : 'Ver'}
          </Button>
        ),
      },
    ],
    [canManageAgenda, onSelectSession, selectedSessionId],
  )

  return (
    <PanelCard>
      <PanelTableHeader countLabel={countLabel} description={description} title={title} />

      <div className="mt-6">
        <DataTable
          columns={sessionColumns}
          getRowClassName={(row) =>
            selectedSessionId === row.id
              ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]'
              : ''
          }
          onRowClick={onSelectSession}
          rows={sessions}
        />
      </div>
    </PanelCard>
  )
}
