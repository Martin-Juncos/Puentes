import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiBell, FiHome, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { NotificationsPanel } from '@/components/private/NotificationsPanel'
import { Button } from '@/components/ui/Button'
import { IdentityTextStack } from '@/components/ui/IdentityTextStack'
import { privateNavigation } from '@/constants/navigation'
import { media } from '@/constants/media'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { usePanelNotifications } from '@/hooks/usePanelNotifications'
import { cn } from '@/utils/cn'
import { getNotificationNavigationTarget } from '@/utils/notificationRouting'

const MotionDiv = motion.div
const rolesWithMessaging = ['COORDINATION', 'SECRETARY', 'PROFESSIONAL']
const rolesWithNotifications = ['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL']
const privateTopbarActionClass =
  'group !rounded-full min-h-10 border border-[var(--color-border-soft)] !bg-white/88 px-3.5 py-1.5 shadow-[0_8px_20px_rgba(47,93,115,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:!bg-[var(--color-primary)] hover:!text-white hover:shadow-[0_12px_26px_rgba(47,93,115,0.16)]'
const privateTopbarIconClass =
  'flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-white/16 group-hover:text-white'
const privateTopbarUserSummaryClass =
  'flex min-w-0 items-center gap-2.5 rounded-full border border-[var(--color-border-soft)] bg-white/88 px-3.5 py-1.5 shadow-[0_8px_20px_rgba(47,93,115,0.06)]'

export const PrivateLayout = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = privateNavigation.filter((item) => item.roles.includes(user.role))
  const canUseMessaging = rolesWithMessaging.includes(user.role)
  const canUseNotifications = rolesWithNotifications.includes(user.role)
  const notificationsRef = useRef(null)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

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
  } = usePanelNotifications({ enabled: canUseNotifications })

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

  const handleLogout = () => {
    setIsMobileNavOpen(false)
    logout()
  }

  const handleOpenNotification = async (notification) => {
    if (!notification.isRead) {
      await handleMarkNotificationRead(notification.id)
    }

    closeNotifications()
    navigate(getNotificationNavigationTarget({ canUseMessaging, notification }))
  }

  const renderNavigationLinks = () =>
    items.map((item) => {
      const Icon = item.icon

      return (
        <NavLink
          key={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[rgba(46,46,46,0.75)] hover:bg-[rgba(47,93,115,0.06)] hover:text-[var(--color-primary)]',
            )
          }
          onClick={() => setIsMobileNavOpen(false)}
          to={item.to}
        >
          {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
          <span>{item.label}</span>
        </NavLink>
      )
    })

  const renderUserSummary = () => (
    <div className="flex items-center gap-2 rounded-2xl bg-[rgba(47,93,115,0.07)] px-3.5 py-2">
      <div className="flex size-7 items-center justify-center rounded-full bg-white text-[var(--color-primary)]">
        <FiUser aria-hidden="true" className="size-3.5" />
      </div>
      <IdentityTextStack
        className="gap-0.5"
        subtitle={ROLE_LABELS[user.role]}
        subtitleClassName="text-[0.58rem] tracking-[0.14em] text-[rgba(47,93,115,0.65)]"
        title={user.fullName}
        titleClassName="text-[0.95rem]"
        truncate
      />
    </div>
  )

  return (
    <div className="panel-gradient panel-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[var(--layout-max-private)] gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <aside className="sidebar-surface panel-sidebar hidden w-72 shrink-0 p-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <img alt={media.logo.alt} className="h-11 w-11 rounded-full bg-white/80 p-1" src={media.logo.src} />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.55)]">Panel interno</p>
              <p className="text-lg font-semibold text-[var(--color-primary)]">Puentes</p>
            </div>
          </div>

          <div className="mt-6">{renderUserSummary()}</div>

          <nav className="mt-6 grid gap-2">{renderNavigationLinks()}</nav>
        </aside>

        <div className="panel-content relative min-w-0 flex-1 overflow-visible">
          <div className="topbar-surface panel-topbar relative z-40 mb-6 flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Button
                aria-expanded={isMobileNavOpen}
                aria-label={isMobileNavOpen ? 'Cerrar navegación interna' : 'Abrir navegación interna'}
                className={cn(privateTopbarActionClass, '!size-10 !min-h-0 !p-0 lg:hidden')}
                onClick={() => setIsMobileNavOpen((current) => !current)}
                size="icon"
                variant="outline"
              >
                {isMobileNavOpen ? (
                  <FiX aria-hidden="true" className="size-5" />
                ) : (
                  <FiMenu aria-hidden="true" className="size-5" />
                )}
              </Button>

              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.58)]">Operación diaria</p>
                <h1 className="mt-2 text-2xl font-semibold text-[var(--color-primary)] md:text-[2rem]">
                  Gestión interna y seguimiento del centro
                </h1>
                <p className="mt-2 text-sm leading-7 text-[rgba(46,46,46,0.66)]">
                  Panel operativo para agenda, acompañamiento y trabajo articulado por roles.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <Button as={NavLink} className={cn(privateTopbarActionClass, 'gap-2.5')} size="sm" to="/" variant="outline">
                <div className={privateTopbarIconClass}>
                  <FiHome aria-hidden="true" className="size-3.5" />
                </div>
                <span className="text-[0.9rem] leading-none transition-colors duration-200 group-hover:text-white">
                  Volver al inicio
                </span>
              </Button>

              <div className={privateTopbarUserSummaryClass}>
                <div className="flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
                  <FiUser aria-hidden="true" className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.9rem] font-semibold leading-none text-[var(--color-primary)]">{user.fullName}</p>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] leading-tight text-[rgba(47,93,115,0.62)]">Sesión activa</p>
                </div>
              </div>

              {canUseNotifications ? (
                <div className="relative z-50" ref={notificationsRef}>
                  <Button
                    aria-expanded={isNotificationsOpen}
                    aria-haspopup="dialog"
                    className={cn(privateTopbarActionClass, 'relative !size-10 !min-h-0 !p-0')}
                    onClick={handleToggleNotifications}
                    size="icon"
                    variant="outline"
                  >
                    <div className={privateTopbarIconClass}>
                      <FiBell aria-hidden="true" className="size-4" />
                    </div>
                    {unreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 py-1 text-[10px] font-semibold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    ) : null}
                  </Button>

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

              <Button className={cn(privateTopbarActionClass, 'gap-2.5')} onClick={handleLogout} size="sm" variant="outline">
                <div className={privateTopbarIconClass}>
                  <FiLogOut aria-hidden="true" className="size-3.5" />
                </div>
                Cerrar sesión
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileNavOpen ? (
              <MotionDiv
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 lg:hidden"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: -8 }}
              >
                <div className="sidebar-surface space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <img alt={media.logo.alt} className="h-10 w-10 rounded-full bg-white/80 p-1" src={media.logo.src} />
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-[rgba(47,93,115,0.55)]">Navegación interna</p>
                      <p className="text-base font-semibold text-[var(--color-primary)]">Puentes</p>
                    </div>
                  </div>
                  {renderUserSummary()}
                  <nav className="grid gap-2">{renderNavigationLinks()}</nav>
                </div>
              </MotionDiv>
            ) : null}
          </AnimatePresence>

          <div className="relative z-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
