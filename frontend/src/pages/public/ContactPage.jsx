import { useEffect, useState } from 'react'

import { ContactForm } from '@/features/contact/ContactForm'
import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { settingsService } from '@/services/settingsService'

const fallbackSettings = {
  centerName: 'Puentes',
  address: 'Buenos Aires, Argentina',
  institutionalEmail: 'contacto@puentes.local',
  institutionalPhone: '+54 11 5555 0000',
  whatsappUrl: 'https://wa.me/5491100000000?text=Hola%20Puentes',
  businessHoursSummary: 'Lunes a viernes de 8 a 20 h.',
}

export const ContactPage = () => {
  const [settings, setSettings] = useState(fallbackSettings)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const nextSettings = await settingsService.getPublic()
        setSettings((current) => ({
          ...current,
          ...nextSettings,
        }))
      } catch {
        // Si la configuración pública no está disponible, se mantienen valores de respaldo.
      }
    }

    loadSettings()
  }, [])

  return (
    <div className="public-shell py-16 lg:py-24">
      <SectionHeading
        description="Podés escribirnos para orientación institucional, consultas iniciales o coordinación de una primera entrevista."
        eyebrow="Contacto"
        title="Abrimos un canal claro para escuchar, orientar y ordenar el primer paso."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <PanelCard className="bg-white/85">
          <ContactForm />
        </PanelCard>

        <div className="grid gap-6">
          <PanelCard className="bg-[rgba(47,93,115,0.94)] text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Contacto operativo</p>
            <h3 className="mt-4 text-3xl font-semibold">Canales de {settings.centerName}</h3>
            <div className="mt-6 grid gap-4 text-sm leading-7 text-white/82">
              <p>{settings.address}</p>
              <p>{settings.institutionalEmail}</p>
              <p>{settings.institutionalPhone}</p>
              <p>{settings.businessHoursSummary}</p>
            </div>
            <a
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)]"
              href={settings.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              Escribir por WhatsApp
            </a>
          </PanelCard>

          <img alt="Espacio de contacto y acompañamiento" className="h-80 w-full rounded-[2rem] object-cover" src="/media/9.jpg" />
        </div>
      </div>
    </div>
  )
}
