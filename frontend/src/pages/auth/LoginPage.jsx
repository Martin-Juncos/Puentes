import { FiArrowLeft, FiShield } from 'react-icons/fi'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PanelCard } from '@/components/ui/PanelCard'
import { media } from '@/constants/media'
import { AuthForm } from '@/features/auth/AuthForm'
import { useAuth } from '@/hooks/useAuth'

export const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate replace to="/app/dashboard" />
  }

  const nextPath = location.state?.from?.pathname ?? '/app/dashboard'

  return (
    <div className="public-gradient flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <PanelCard className="overflow-hidden bg-[rgba(47,93,115,0.94)] text-white" padding="lg">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.26em] text-white/70">Ingreso interno</p>
            <Button as={NavLink} className="gap-2 text-white hover:bg-white/10" to="/" variant="ghost">
              <FiArrowLeft aria-hidden="true" className="size-4" />
              Volver al inicio
            </Button>
          </div>

          <h1 className="heading-display mt-5 text-5xl font-semibold">
            Agenda, gestión y seguimiento en un solo lugar.
          </h1>
          <p className="mt-6 text-sm leading-8 text-white/80">
            El panel privado está pensado para secretaría, coordinación, profesionales y administración general. No es
            un acceso para autogestión de familias en esta etapa.
          </p>

          <div className="public-media-frame mt-8 border-white/10 bg-white/8 p-3 shadow-none">
            <img alt={media.loginPanel.alt} className="h-72 w-full rounded-[1.75rem] object-cover" src={media.loginPanel.src} />
          </div>
        </PanelCard>

        <PanelCard className="bg-white/92" padding="lg" variant="form">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
              <FiShield aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="eyebrow-label">Panel operativo</p>
              <p className="mt-2 text-xl font-semibold text-[var(--color-primary)]">Ingresar a Puentes</p>
            </div>
          </div>

          <div className="mt-8">
            <AuthForm
              emailHint="Usá el correo institucional asignado para tu rol."
              onSuccess={() => navigate(nextPath, { replace: true })}
              passwordHint="Usuarios demo disponibles luego del seed."
            />
          </div>
        </PanelCard>
      </div>
    </div>
  )
}
