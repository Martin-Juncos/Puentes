import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  FiArrowRight,
  FiClock,
  FiLogIn,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiPhone,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
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
const footerNavigation = publicNavigation.filter((item) => item.to !== '/')
const footerFallbackSettings = {
  centerName: 'Puentes',
  address: 'Buenos Aires, Argentina',
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
            <img alt={media.logo.alt} className="h-10 w-10 rounded-full bg-white/80 p-1" src={media.logo.src} />
            <div className="min-w-0">
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[rgba(47,93,115,0.6)]">
                Centro interdisciplinario
              </p>
              <p className="truncate text-[1.85rem] font-semibold leading-none text-[var(--color-primary)] sm:text-[2.1rem]">
                Puentes
              </p>
            </div>
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
                  className="h-auto rounded-full border border-[var(--color-border-soft)] bg-white/85 px-4 py-2 text-left hover:bg-white"
                  to="/app/dashboard"
                  variant="ghost"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
                    <FiUser aria-hidden="true" className="size-4" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">{user.fullName}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.62)]">
                      {ROLE_LABELS[user.role]}
                    </p>
                  </div>
                </Button>
                <Button className="gap-2" onClick={handleLogout} variant="ghost">
                  <FiLogOut aria-hidden="true" className="size-4" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button as={NavLink} className="gap-2" to="/contacto" variant="outline">
                  <FiMessageCircle aria-hidden="true" className="size-4" />
                  Consultar
                </Button>
                <Button className="gap-2" onClick={() => setIsAccessOpen(true)}>
                  <FiLogIn aria-hidden="true" className="size-4" />
                  Ingresar
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
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
                        <FiUser aria-hidden="true" className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-primary)]">{user.fullName}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.62)]">
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
                    <Button as={NavLink} onClick={() => setIsMobileNavOpen(false)} to="/contacto" variant="outline">
                      Consultar
                    </Button>
                    <Button
                      className="gap-2"
                      onClick={() => {
                        setIsMobileNavOpen(false)
                        setIsAccessOpen(true)
                      }}
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

      <footer className="pt-8 lg:pt-12">
        <div className="public-shell pb-10 lg:pb-12">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-[var(--color-border-soft)] bg-[linear-gradient(145deg,rgba(247,244,238,0.96),rgba(255,255,255,0.98),rgba(241,246,245,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(47,93,115,0.12)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-10">
            <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-[rgba(167,196,181,0.16)] blur-3xl" />
            <div className="absolute bottom-0 left-12 h-32 w-32 rounded-full bg-[rgba(217,140,122,0.14)] blur-3xl" />

            <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.72fr_0.9fr]">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <img alt={media.logo.alt} className="h-12 w-12 rounded-full bg-white/85 p-1.5 shadow-sm" src={media.logo.src} />
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.32em] text-[rgba(47,93,115,0.62)]">
                      Centro interdisciplinario
                    </p>
                    <p className="heading-display text-3xl font-semibold text-[var(--color-primary)]">
                      {displaySettings.centerName}
                    </p>
                  </div>
                </div>

                <h2 className="heading-display mt-6 text-4xl font-semibold leading-[0.95] text-[var(--color-primary)] sm:text-[3.8rem]">
                  Orientamos procesos, articulamos equipos y cuidamos el vínculo con las familias.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(46,46,46,0.74)]">
                  Puentes reúne acompañamiento, organización institucional y contacto cercano para que cada consulta
                  encuentre un camino claro desde el primer intercambio.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[rgba(47,93,115,0.62)]">
                  <span className="rounded-full border border-[rgba(47,93,115,0.12)] bg-white/72 px-3 py-2">
                    Trabajo con familias
                  </span>
                  <span className="rounded-full border border-[rgba(47,93,115,0.12)] bg-white/72 px-3 py-2">
                    Equipo interdisciplinario
                  </span>
                  <span className="rounded-full border border-[rgba(47,93,115,0.12)] bg-white/72 px-3 py-2">
                    Organización institucional
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button as={NavLink} className="gap-2" to="/contacto">
                    Solicitar orientación
                    <FiArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                  {isAuthenticated ? (
                    <Button as={NavLink} className="gap-2" to="/app/dashboard" variant="outline">
                      Ir al panel
                    </Button>
                  ) : (
                    <Button className="gap-2" onClick={() => setIsAccessOpen(true)} variant="outline">
                      <FiLogIn aria-hidden="true" className="size-4" />
                      Acceso institucional
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid content-start gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">Explorar</p>
                <nav className="grid gap-2">
                  {footerNavigation.map((item) => (
                    <NavLink
                      key={item.to}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center justify-between rounded-[1.35rem] border border-transparent bg-white/58 px-4 py-3 text-sm font-medium text-[rgba(46,46,46,0.78)] transition-colors hover:border-[rgba(47,93,115,0.12)] hover:bg-white/86 hover:text-[var(--color-primary)]',
                          isActive && 'border-[rgba(47,93,115,0.12)] bg-white text-[var(--color-primary)]',
                        )
                      }
                      to={item.to}
                    >
                      <span>{item.label}</span>
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 opacity-55 transition-transform group-hover:translate-x-0.5"
                      />
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.5rem] border border-[rgba(47,93,115,0.1)] bg-white/76 px-5 py-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <FiMail aria-hidden="true" className="mt-1 size-4 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">Correo</p>
                      <a
                        className="mt-1 block text-sm leading-6 text-[rgba(46,46,46,0.82)]"
                        href={`mailto:${displaySettings.institutionalEmail}`}
                      >
                        {displaySettings.institutionalEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[rgba(47,93,115,0.1)] bg-white/76 px-5 py-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <FiPhone aria-hidden="true" className="mt-1 size-4 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">Teléfono</p>
                      <a
                        className="mt-1 block text-sm leading-6 text-[rgba(46,46,46,0.82)]"
                        href={`tel:${sanitizePhoneHref(displaySettings.institutionalPhone)}`}
                      >
                        {displaySettings.institutionalPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[rgba(47,93,115,0.1)] bg-white/76 px-5 py-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <FiClock aria-hidden="true" className="mt-1 size-4 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">Horarios</p>
                      <p className="mt-1 text-sm leading-6 text-[rgba(46,46,46,0.82)]">
                        {displaySettings.businessHoursSummary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 flex flex-col gap-3 border-t border-[rgba(47,93,115,0.1)] pt-5 text-xs uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  © {new Date().getFullYear()} {displaySettings.centerName}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[rgba(47,93,115,0.28)] lg:block" />
                <span className="inline-flex items-center gap-2">
                  <FiMapPin aria-hidden="true" className="size-3.5" />
                  {displaySettings.address}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  className="rounded-full border border-[rgba(47,93,115,0.12)] bg-white/72 px-3 py-2 transition-colors hover:bg-white"
                  href={`mailto:${displaySettings.institutionalEmail}`}
                >
                  Correo institucional
                </a>
                <a
                  className="rounded-full border border-[rgba(47,93,115,0.12)] bg-white/72 px-3 py-2 transition-colors hover:bg-white"
                  href={displaySettings.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
