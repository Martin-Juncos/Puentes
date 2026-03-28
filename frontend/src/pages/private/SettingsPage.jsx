import { PanelCard } from '@/components/ui/PanelCard'

const settings = [
  {
    title: 'Autenticación',
    description: 'JWT en cookie httpOnly con backend Express y permisos base por rol.',
  },
  {
    title: 'Integraciones preparadas',
    description: 'SMTP para contacto institucional, Cloudinary como adapter futuro y WhatsApp como canal operativo.',
  },
  {
    title: 'Crecimiento previsto',
    description: 'Novedades administrables, área privada para familias y trazabilidad operativa en etapas posteriores.',
  },
]

export const SettingsPage = () => (
  <div className="grid gap-6">
    <PanelCard>
      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">Configuración mínima</p>
      <h2 className="mt-3 text-3xl font-semibold text-[var(--color-primary)]">Base técnica preparada para iterar.</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(46,46,46,0.72)]">
        En este MVP la configuración general se mantiene deliberadamente acotada: el objetivo es sostener una base sólida antes de abrir opciones que multipliquen complejidad administrativa.
      </p>
    </PanelCard>

    <div className="grid gap-6 lg:grid-cols-3">
      {settings.map((item, index) => (
        <PanelCard className={index === 1 ? 'bg-[rgba(47,93,115,0.94)] text-white' : ''} key={item.title}>
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className={`mt-4 text-sm leading-7 ${index === 1 ? 'text-white/76' : 'text-[rgba(46,46,46,0.72)]'}`}>
            {item.description}
          </p>
        </PanelCard>
      ))}
    </div>
  </div>
)
