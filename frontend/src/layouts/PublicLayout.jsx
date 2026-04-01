import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  FiClock,
  FiLogIn,
  FiLogOut,
  FiMail,
  FiMenu,
  FiMessageCircle,
  FiPhone,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AnimatedBrandLockup } from '@/components/ui/AnimatedBrandLockup'
import { Button } from '@/components/ui/Button'
import { FloatingWhatsAppButton } from '@/components/ui/FloatingWhatsAppButton'
import { ModalShell } from '@/components/ui/ModalShell'
import { publicNavigation } from '@/constants/navigation'
import { media } from '@/constants/media'
import { ROLE_LABELS } from '@/constants/roles'
import { AuthForm } from '@/features/auth/AuthForm'
import { useAuth } from '@/hooks/useAuth'
import { settingsService } from '@/services/settingsService'
import { cn } from '@/utils/cn'

const MotionMain = motion.main
const MotionDiv = motion.div
const footerPrimaryLinks = publicNavigation.slice(0, 4)
const footerSecondaryLinks = publicNavigation.slice(4)
const desktopAuthActionClass =
  'group !rounded-full min-h-10 border border-[var(--color-border-soft)] !bg-white/88 px-3.5 py-1.5 shadow-[0_8px_20px_rgba(47,93,115,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:!bg-[var(--color-primary)] hover:!text-white hover:shadow-[0_12px_26px_rgba(47,93,115,0.16)]'
const footerFallbackSettings = {
  centerName: 'Puentes',
  address: 'España 930, Goya, Corrientes',
  institutionalEmail: 'contacto@puentes.local',
  institutionalPhone: '+54 11 5555 0000',
  whatsappUrl: 'https://wa.me/5491100000000?text=Hola%20Puentes',
  businessHoursSummary: 'Lunes a viernes de 8 a 20 h.',
}

const normalizeTextSetting = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed || fallback
}

const sanitizePhoneHref = (phone) => phone.replace(/[^\d+]/g, '')

export const PublicLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [isAccessOpen, setIsAccessOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [footerSettings, setFooterSettings] = useState(footerFallbackSettings)

  const currentSectionLabel = useMemo(
    () => publicNavigation.find((item) => item.to === location.pathname)?.label ?? 'Puentes',
    [location.pathname],
  )

  const displaySettings = useMemo(
    () => ({
      centerName: normalizeTextSetting(footerSettings.centerName, footerFallbackSettings.centerName),
      address: normalizeTextSetting(footerSettings.address, footerFallbackSettings.address),
      institutionalEmail: normalizeTextSetting(
        footerSettings.institutionalEmail,
        footerFallbackSettings.institutionalEmail,
      ),
      institutionalPhone: normalizeTextSetting(
        footerSettings.institutionalPhone,
        footerFallbackSettings.institutionalPhone,
      ),
      whatsappUrl: normalizeTextSetting(footerSettings.whatsappUrl, footerFallbackSettings.whatsappUrl),
      businessHoursSummary: normalizeTextSetting(
        footerSettings.businessHoursSummary,
        footerFallbackSettings.businessHoursSummary,
      ),
    }),
    [footerSettings],
  )

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const nextSettings = await settingsService.getPublic()
        setFooterSettings((current) => ({
          ...current,
          ...nextSettings,
        }))
      } catch {
        // Si la configuración pública no está disponible, se mantienen valores de respaldo.
      }
    }

    void loadFooterSettings()
  }, [])

  const closeAllOverlays = () => {
    setIsAccessOpen(false)
    setIsMobileNavOpen(false)
  }

  const handleLoginSuccess = () => {
    closeAllOverlays()
    navigate('/app/dashboard')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="public-gradient min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border-soft)] bg-[rgba(247,244,238,0.9)] backdrop-blur-xl">
        <div className="public-shell flex items-center gap-4 py-4">
          <NavLink className="flex min-w-0 items-center gap-3" to="/">
            <AnimatedBrandLockup logoAlt={media.logo.alt} logoSrc={media.logo.src} />
          </NavLink>

          <nav className="ml-6 hidden items-center gap-6 text-sm font-medium text-[rgba(46,46,46,0.74)] md:flex">
            {publicNavigation.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  cn(
                    'transition-colors hover:text-[var(--color-primary)]',
                    isActive && 'text-[var(--color-primary)]',
                  )
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Button
                  as={NavLink}
                  className={cn(desktopAuthActionClass, 'h-auto justify-start gap-2.5 text-left')}
                  size="sm"
                  to="/app/dashboard"
                  variant="outline"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-white/16 group-hover:text-white">
                    <FiUser aria-hidden="true" className="size-3.5" />
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:gap-0">
                    <p className="mt-3 text-[0.9rem] font-semibold leading-none text-[var(--color-primary)] transition-colors duration-200 group-hover:text-white">
                      {user.fullName}
                    </p>
                    <p className="-mt-1.5 text-[0.55rem] uppercase tracking-[0.16em] leading-none text-[rgba(47,93,115,0.62)] transition-colors duration-200 group-hover:text-white/78">
                      {ROLE_LABELS[user.role]}
                    </p>
                  </div>
                </Button>
                <Button
                  className={cn(desktopAuthActionClass, 'gap-2.5')}
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-white/16 group-hover:text-white">
                    <FiLogOut aria-hidden="true" className="size-3.5" />
                  </div>
                  <span className="text-[0.9rem] leading-none transition-colors duration-200 group-hover:text-white">Salir</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={NavLink}
                  className={cn(desktopAuthActionClass, 'gap-2.5')}
                  size="sm"
                  to="/contacto"
                  variant="outline"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-white/16 group-hover:text-white">
                    <FiMessageCircle aria-hidden="true" className="size-3.5" />
                  </div>
                  <span className="text-[0.9rem] leading-none transition-colors duration-200 group-hover:text-white">Consultar</span>
                </Button>
                <Button
                  className={cn(desktopAuthActionClass, 'gap-2.5')}
                  onClick={() => setIsAccessOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-white/16 group-hover:text-white">
                    <FiLogIn aria-hidden="true" className="size-3.5" />
                  </div>
                  <span className="text-[0.9rem] leading-none transition-colors duration-200 group-hover:text-white">Ingresar</span>
                </Button>
              </>
            )}
          </div>

          <Button
            aria-expanded={isMobileNavOpen}
            aria-label={isMobileNavOpen ? 'Cerrar navegación' : 'Abrir navegación'}
            className="ml-auto md:hidden"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            size="icon"
            variant="outline"
          >
            {isMobileNavOpen ? <FiX aria-hidden="true" className="size-5" /> : <FiMenu aria-hidden="true" className="size-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {isMobileNavOpen ? (
            <MotionDiv
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.92)] md:hidden"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
            >
              <div className="public-shell grid gap-3 py-4">
                <div className="rounded-[1.5rem] border border-[var(--color-border-soft)] bg-white/92 px-4 py-3">
                  <p className="eyebrow-label">Navegación actual</p>
                  <p className="mt-2 text-base font-semibold text-[var(--color-primary)]">{currentSectionLabel}</p>
                </div>

                <nav className="grid gap-2">
                  {publicNavigation.map((item) => (
                    <NavLink
                      key={item.to}
                      className={({ isActive }) =>
                        cn(
                          'rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[rgba(46,46,46,0.78)] transition-colors hover:bg-[rgba(47,93,115,0.05)] hover:text-[var(--color-primary)]',
                          isActive && 'border-[var(--color-border-soft)] bg-white text-[var(--color-primary)]',
                        )
                      }
                      onClick={() => setIsMobileNavOpen(false)}
                      to={item.to}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                {isAuthenticated ? (
                  <div className="grid gap-2 rounded-[1.5rem] border border-[var(--color-border-soft)] bg-white/92 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
                        <FiUser aria-hidden="true" className="size-3.5" />
                      </div>
                      <div className="flex flex-col gap-0">
                        <p className="text-[0.95rem] font-semibold leading-none text-[var(--color-primary)]">{user.fullName}</p>
                        <p className="text-[0.58rem] uppercase tracking-[0.14em] leading-none text-[rgba(47,93,115,0.62)]">
                          {ROLE_LABELS[user.role]}
                        </p>
                      </div>
                    </div>
                    <Button as={NavLink} onClick={() => setIsMobileNavOpen(false)} to="/app/dashboard" variant="outline">
                      Ir al panel
                    </Button>
                    <Button className="gap-2" onClick={handleLogout} variant="ghost">
                      <FiLogOut aria-hidden="true" className="size-4" />
                      Salir
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Button as={NavLink} className="gap-2" onClick={() => setIsMobileNavOpen(false)} to="/contacto" variant="outline">
                      <FiMessageCircle aria-hidden="true" className="size-4" />
                      Consultar
                    </Button>
                    <Button
                      className="gap-2"
                      onClick={() => {
                        setIsMobileNavOpen(false)
                        setIsAccessOpen(true)
                      }}
                      variant="outline"
                    >
                      <FiLogIn aria-hidden="true" className="size-4" />
                      Ingresar
                    </Button>
                  </div>
                )}
              </div>
            </MotionDiv>
          ) : null}
        </AnimatePresence>
      </header>

      <MotionMain
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Outlet />
      </MotionMain>

      <footer className="mt-8 border-t border-[rgba(47,93,115,0.12)] bg-[linear-gradient(180deg,rgba(238,245,243,0.92),rgba(247,244,238,0.95))]">
        <div className="public-shell py-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-start">
            <div className="space-y-4 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-[rgba(47,93,115,0.62)]">Puentes</p>
              <nav className="grid gap-3 text-base text-[rgba(46,46,46,0.8)]">
                {footerPrimaryLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    className={({ isActive }) =>
                      cn('transition-colors hover:text-[var(--color-primary)]', isActive && 'text-[var(--color-primary)]')
                    }
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="text-center">
              <h2 className="heading-display text-4xl font-semibold text-[var(--color-primary)] sm:text-5xl">
                {displaySettings.centerName}
              </h2>
              <p className="mt-4 text-lg text-[rgba(46,46,46,0.78)]">
                Acompañamiento del desarrollo infantil con cercanía, claridad y trabajo articulado.
              </p>
              <p className="mt-2 text-sm text-[rgba(47,93,115,0.62)]">
                {displaySettings.address} · {displaySettings.businessHoursSummary}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  aria-label="Enviar correo institucional"
                  className="flex size-16 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white/78 text-[var(--color-primary)] shadow-[0_12px_34px_rgba(47,93,115,0.08)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white"
                  href={`mailto:${displaySettings.institutionalEmail}`}
                >
                  <FiMail aria-hidden="true" className="size-6" />
                </a>
                <a
                  aria-label="Llamar al centro"
                  className="flex size-16 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white/78 text-[var(--color-primary)] shadow-[0_12px_34px_rgba(47,93,115,0.08)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white"
                  href={`tel:${sanitizePhoneHref(displaySettings.institutionalPhone)}`}
                >
                  <FiPhone aria-hidden="true" className="size-6" />
                </a>
                <a
                  aria-label="Escribir por WhatsApp"
                  className="flex size-16 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white/78 text-[var(--color-primary)] shadow-[0_12px_34px_rgba(47,93,115,0.08)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white"
                  href={displaySettings.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FiMessageCircle aria-hidden="true" className="size-6" />
                </a>
                <div
                  aria-label={`Horarios: ${displaySettings.businessHoursSummary}`}
                  className="flex size-16 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white/78 text-[var(--color-primary)] shadow-[0_12px_34px_rgba(47,93,115,0.08)]"
                  title={displaySettings.businessHoursSummary}
                >
                  <FiClock aria-hidden="true" className="size-6" />
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center lg:text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-[rgba(47,93,115,0.62)]">Atención</p>
              <div className="grid gap-3 text-base text-[rgba(46,46,46,0.8)]">
                {footerSecondaryLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    className={({ isActive }) =>
                      cn('transition-colors hover:text-[var(--color-primary)]', isActive && 'text-[var(--color-primary)]')
                    }
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink className="transition-colors hover:text-[var(--color-primary)]" to="/contacto">
                  Solicitar orientación
                </NavLink>
                {isAuthenticated ? (
                  <NavLink className="transition-colors hover:text-[var(--color-primary)]" to="/app/dashboard">
                    Ir al panel
                  </NavLink>
                ) : (
                  <button className="text-inherit transition-colors hover:text-[var(--color-primary)]" onClick={() => setIsAccessOpen(true)} type="button">
                    Ingresar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[rgba(47,93,115,0.12)] pt-6">
            <div className="flex justify-center">
              <p className="text-center text-sm text-[rgba(46,46,46,0.74)]">
                (c) {new Date().getFullYear()} {displaySettings.centerName}. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <FloatingWhatsAppButton href={displaySettings.whatsappUrl} />

      <ModalShell
        closeLabel="Cerrar ingreso"
        isOpen={isAccessOpen}
        maxWidthClassName="max-w-lg"
        onClose={() => setIsAccessOpen(false)}
      >
        <p className="eyebrow-label pr-10">Ingreso interno</p>
        <h2 className="mt-3 pr-10 text-2xl font-semibold text-[var(--color-primary)]">Ingresar a Puentes</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
          Acceso exclusivo para secretaría, coordinación, profesionales y administración general.
        </p>

        <div className="mt-6">
          <AuthForm
            onSuccess={handleLoginSuccess}
            passwordHint="La familia no autogestiona turnos en esta etapa."
          />
        </div>
      </ModalShell>
    </div>
  )
}
