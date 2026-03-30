import { useEffect, useRef } from 'react'
import { FiBell, FiHome, FiLogOut, FiUser } from 'react-icons/fi'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { NotificationsPanel } from '@/components/private/NotificationsPanel'
import { Button } from '@/components/ui/Button'
import { privateNavigation } from '@/constants/navigation'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { usePanelNotifications } from '@/hooks/usePanelNotifications'

const rolesWithMessaging = ['COORDINATION', 'SECRETARY', 'PROFESSIONAL']

export const PrivateLayout = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = privateNavigation.filter((item) => item.roles.includes(user.role))
  const canUseMessaging = rolesWithMessaging.includes(user.role)
  const notificationsRef = useRef(null)

  const {
    close: closeNotifications,
    error: notificationsError,
    isLoading: isNotificationsLoading,
    isOpen: isNotificationsOpen,
    markAllRead: handleMarkAllNotificationsRead,
    markRead: handleMarkNotificationRead,
    notifications,
    toggle: handleToggleNotifications,
    unreadCount,
  } = usePanelNotifications({ enabled: canUseMessaging })

  useEffect(() => {
    closeNotifications()
  }, [closeNotifications, location.pathname, location.search])

  useEffect(() => {
    if (!isNotificationsOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (!notificationsRef.current?.contains(event.target)) {
        closeNotifications()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [closeNotifications, isNotificationsOpen])

  const handleOpenNotification = async (notification) => {
    if (!notification.isRead) {
      await handleMarkNotificationRead(notification.id)
    }

    closeNotifications()

    if (notification.threadId) {
      navigate(`/app/mensajes?threadId=${notification.threadId}`)
      return
    }

    if (notification.childId) {
      navigate(`/app/mensajes?childId=${notification.childId}&compose=1`)
      return
    }

    navigate('/app/mensajes')
  }

  return (
    <div className="panel-gradient panel-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">
        <aside className="panel-sidebar surface-card h-fit w-full shrink-0 p-5 lg:w-72">
          <div className="flex items-center gap-3">
            <img alt="Puentes" className="h-11 w-11 rounded-full bg-white/80 p-1" src="/media/logo.png" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.55)]">Panel interno</p>
              <p className="text-lg font-semibold text-[var(--color-primary)]">Puentes</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[rgba(47,93,115,0.07)] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white text-[var(--color-primary)]">
                <FiUser aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary)]">{user.fullName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.65)]">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[rgba(46,46,46,0.75)] hover:bg-[rgba(47,93,115,0.06)] hover:text-[var(--color-primary)]'
                    }`
                  }
                  to={item.to}
                >
                  {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <Button className="mt-6 w-full gap-2" onClick={logout} variant="outline">
            <FiLogOut aria-hidden="true" className="size-4" />
            Cerrar sesión
          </Button>
        </aside>

        <div className="panel-content relative flex-1 overflow-visible">
          <div className="panel-topbar relative z-40 mb-6 flex flex-col gap-4 overflow-visible rounded-[2rem] border border-[rgba(47,93,115,0.1)] bg-white/70 px-6 py-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.58)]">Operación diaria</p>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
                Gestión interna y seguimiento del centro
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-full border border-[rgba(47,93,115,0.12)] bg-white/85 px-4 py-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
                  <FiUser aria-hidden="true" className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">{user.fullName}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.62)]">Sesión activa</p>
                </div>
              </div>

              {canUseMessaging ? (
                <div className="relative z-50" ref={notificationsRef}>
                  <button
                    aria-expanded={isNotificationsOpen}
                    aria-haspopup="dialog"
                    className="relative flex size-12 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white/85 text-[var(--color-primary)] transition-colors hover:bg-[rgba(47,93,115,0.06)]"
                    onClick={handleToggleNotifications}
                    type="button"
                  >
                    <FiBell aria-hidden="true" className="size-5" />
                    {unreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 py-1 text-[10px] font-semibold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    ) : null}
                  </button>

                  {isNotificationsOpen ? (
                    <NotificationsPanel
                      error={notificationsError}
                      isLoading={isNotificationsLoading}
                      notifications={notifications}
                      onMarkAllRead={handleMarkAllNotificationsRead}
                      onMarkRead={handleMarkNotificationRead}
                      onOpenNotification={handleOpenNotification}
                      unreadCount={unreadCount}
                    />
                  ) : null}
                </div>
              ) : null}

              <Button as={NavLink} className="gap-2" to="/" variant="outline">
                <FiHome aria-hidden="true" className="size-4" />
                Volver al inicio
              </Button>
            </div>
          </div>

          <div className="relative z-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
