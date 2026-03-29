import { FiBell, FiCheck, FiChevronRight } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { ROLE_LABELS } from '@/constants/roles'
import { formatDateTime } from '@/utils/formatters'

export const NotificationsPanel = ({
  error,
  isLoading,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onOpenNotification,
  unreadCount,
}) => (
  <div className="absolute right-0 top-[calc(100%+0.8rem)] z-[80] w-[min(100vw-2rem,25rem)] overflow-hidden rounded-[1.75rem] border border-[rgba(47,93,115,0.14)] bg-white p-5 shadow-[0_28px_80px_rgba(47,93,115,0.18)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(47,93,115,0.58)]">Notificaciones</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-primary)]">Alertas internas</h2>
      </div>
      <div className="shrink-0 rounded-full bg-[rgba(47,93,115,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
        {unreadCount} nuevas
      </div>
    </div>

    <div className="mt-4 rounded-2xl bg-[rgba(47,93,115,0.04)] p-4">
      <p className="text-[15px] leading-6 text-[rgba(46,46,46,0.74)]">
        Avisos de mensajes por caso y de gestiones generales para coordinación, secretaría y profesionales.
      </p>
      <Button
        className="mt-3 px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
        disabled={!unreadCount}
        onClick={onMarkAllRead}
        type="button"
        variant="outline"
      >
        Marcar todas
      </Button>
    </div>

    {error ? (
      <div className="mt-4 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm leading-6 text-[#8b4b3d]">{error}</div>
    ) : null}

    {isLoading ? (
      <div className="mt-4 rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] bg-[rgba(247,244,238,0.65)] px-4 py-6 text-sm text-[rgba(46,46,46,0.64)]">
        Cargando notificaciones...
      </div>
    ) : null}

    {!isLoading && !notifications.length ? (
      <div className="mt-4 rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] bg-[rgba(247,244,238,0.65)] px-4 py-6 text-sm text-[rgba(46,46,46,0.64)]">
        No hay alertas recientes.
      </div>
    ) : null}

    {!isLoading && notifications.length ? (
      <div className="mt-4 grid max-h-[60vh] gap-3 overflow-y-auto pr-1">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={`rounded-2xl border px-4 py-4 transition-colors ${
              notification.isRead
                ? 'border-[rgba(47,93,115,0.1)] bg-white'
                : 'border-[rgba(47,93,115,0.16)] bg-[rgba(47,93,115,0.05)]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full ${
                  notification.type === 'THREAD_ASSIGNED'
                    ? 'bg-[rgba(167,196,181,0.28)] text-[var(--color-primary)]'
                    : 'bg-[rgba(217,140,122,0.16)] text-[#8b4b3d]'
                }`}
              >
                <FiBell aria-hidden="true" className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold leading-6 text-[var(--color-primary)]">{notification.title}</p>
                  {!notification.isRead ? (
                    <span className="rounded-full bg-[rgba(47,93,115,0.12)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                      Nueva
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-[rgba(46,46,46,0.76)]">
                  {notification.bodyPreview || 'Abri la conversacion para ver el detalle.'}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-[rgba(47,93,115,0.64)]">
                  {notification.child ? <span>{notification.child.firstName} {notification.child.lastName}</span> : null}
                  {notification.actorUser ? <span>{ROLE_LABELS[notification.actorUser.role]}</span> : null}
                  <span>{formatDateTime(notification.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                className="gap-1 px-4 py-2 text-[11px] uppercase tracking-[0.14em]"
                onClick={() => onOpenNotification(notification)}
                type="button"
                variant="outline"
              >
                Ver conversacion
                <FiChevronRight aria-hidden="true" className="size-4" />
              </Button>
              {!notification.isRead ? (
                <Button
                  className="gap-1 px-4 py-2 text-[11px] uppercase tracking-[0.14em]"
                  onClick={() => onMarkRead(notification.id)}
                  type="button"
                  variant="ghost"
                >
                  <FiCheck aria-hidden="true" className="size-4" />
                  Marcar leida
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    ) : null}
  </div>
)
