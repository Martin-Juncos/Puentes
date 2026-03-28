import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiLogIn, FiLogOut, FiMessageCircle, FiUser, FiX } from 'react-icons/fi'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PanelCard } from '@/components/ui/PanelCard'
import { publicNavigation } from '@/constants/navigation'
import { ROLE_LABELS } from '@/constants/roles'
import { AuthForm } from '@/features/auth/AuthForm'
import { useAuth } from '@/hooks/useAuth'

const MotionMain = motion.main
const MotionDiv = motion.div

export const PublicLayout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [isAccessOpen, setIsAccessOpen] = useState(false)

  useEffect(() => {
    if (!isAccessOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccessOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isAccessOpen])

  const openAccess = () => setIsAccessOpen(true)
  const closeAccess = () => setIsAccessOpen(false)

  const handleLoginSuccess = () => {
    closeAccess()
    navigate('/app/dashboard')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="public-gradient min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[rgba(47,93,115,0.08)] bg-[rgba(247,244,238,0.9)] backdrop-blur-xl">
        <div className="public-shell flex flex-wrap items-center justify-between gap-4 py-4">
          <NavLink className="flex items-center gap-3" to="/">
            <img alt="Puentes" className="h-10 w-10 rounded-full bg-white/80 p-1" src="/media/logo.png" />
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[rgba(47,93,115,0.6)]">Centro interdisciplinario</p>
              <p className="text-[1.85rem] font-semibold leading-none text-[var(--color-primary)] sm:text-[2.1rem]">Puentes</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[rgba(46,46,46,0.74)] md:flex">
            {publicNavigation.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  isActive ? 'text-[var(--color-primary)]' : 'transition-colors hover:text-[var(--color-primary)]'
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  as={NavLink}
                  className="h-auto gap-3 rounded-full border border-[rgba(47,93,115,0.14)] bg-white/80 px-4 py-2 text-left hover:bg-white"
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
                <Button className="gap-2" onClick={openAccess}>
                  <FiLogIn aria-hidden="true" className="size-4" />
                  Ingresar
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <MotionMain
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Outlet />
      </MotionMain>

      <footer className="border-t border-[rgba(47,93,115,0.1)] bg-white/60">
        <div className="public-shell grid gap-8 py-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="heading-display text-3xl font-semibold text-[var(--color-primary)]">Puentes</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Plataforma institucional y operativa para acompañar el desarrollo infantil, fortalecer el trabajo con
              familias y ordenar la gestión cotidiana del centro.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Capas</p>
            <ul className="mt-4 space-y-2 text-sm text-[rgba(46,46,46,0.74)]">
              <li>Presencia institucional</li>
              <li>Agenda y seguimiento</li>
              <li>Operación interna por roles</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Contacto</p>
            <ul className="mt-4 space-y-2 text-sm text-[rgba(46,46,46,0.74)]">
              <li>Buenos Aires, Argentina</li>
              <li>contacto@puentes.local</li>
              <li>+54 11 5555 0000</li>
            </ul>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAccessOpen ? (
          <MotionDiv
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,39,45,0.48)] px-4 py-8 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeAccess}
          >
            <MotionDiv
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg"
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <PanelCard className="relative rounded-[2rem] bg-[rgba(247,244,238,0.98)] p-7 shadow-[0_24px_80px_rgba(47,93,115,0.18)]">
                <button
                  aria-label="Cerrar ingreso"
                  className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white text-[var(--color-primary)] transition-colors hover:bg-[rgba(47,93,115,0.05)]"
                  onClick={closeAccess}
                  type="button"
                >
                  <FiX aria-hidden="true" className="size-4" />
                </button>

                <p className="text-xs uppercase tracking-[0.26em] text-[rgba(47,93,115,0.58)]">Ingreso interno</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">Ingresar a Puentes</h2>
                <p className="mt-3 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
                  Acceso exclusivo para secretaría, coordinación, profesionales y administración general.
                </p>

                <div className="mt-6">
                  <AuthForm
                    onSuccess={handleLoginSuccess}
                    passwordHint="La familia no autogestiona turnos en esta etapa."
                  />
                </div>
              </PanelCard>
            </MotionDiv>
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
