import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PanelCard } from '@/components/ui/PanelCard'

export const NotFoundPage = () => (
  <div className="public-gradient flex min-h-screen items-center justify-center px-4">
    <PanelCard className="max-w-xl text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.58)]">404</p>
      <h1 className="heading-display mt-4 text-5xl font-semibold text-[var(--color-primary)]">
        No encontramos esa página.
      </h1>
      <p className="mt-5 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
        Podés volver al sitio institucional o ingresar al panel si ya contás con acceso interno.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button as={NavLink} to="/">
          Ir al inicio
        </Button>
        <Button as={NavLink} to="/login" variant="outline">
          Ir al panel
        </Button>
      </div>
    </PanelCard>
  </div>
)
