import { FiHome, FiLogOut, FiUser } from 'react-icons/fi'
import { NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { privateNavigation } from '@/constants/navigation'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'

export const PrivateLayout = () => {
  const { logout, user } = useAuth()
  const items = privateNavigation.filter((item) => item.roles.includes(user.role))

  return (
    <div className="panel-gradient min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">
        <aside className="surface-card h-fit w-full shrink-0 p-5 lg:w-72">
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

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[rgba(47,93,115,0.1)] bg-white/70 px-6 py-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
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

              <Button as={NavLink} className="gap-2" to="/" variant="outline">
                <FiHome aria-hidden="true" className="size-4" />
                Volver al inicio
              </Button>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
