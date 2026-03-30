import { useEffect, useMemo, useState } from 'react'
import { FiClock, FiMail, FiMapPin, FiMessageCircle, FiPhone } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'
import { ContactForm } from '@/features/contact/ContactForm'
import { settingsService } from '@/services/settingsService'

const fallbackSettings = {
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

    void loadSettings()
  }, [])

  const displaySettings = useMemo(
    () => ({
      centerName: normalizeTextSetting(settings.centerName, fallbackSettings.centerName),
      address: normalizeTextSetting(settings.address, fallbackSettings.address),
      institutionalEmail: normalizeTextSetting(settings.institutionalEmail, fallbackSettings.institutionalEmail),
      institutionalPhone: normalizeTextSetting(settings.institutionalPhone, fallbackSettings.institutionalPhone),
      whatsappUrl: normalizeTextSetting(settings.whatsappUrl, fallbackSettings.whatsappUrl),
      businessHoursSummary: normalizeTextSetting(settings.businessHoursSummary, fallbackSettings.businessHoursSummary),
    }),
    [settings],
  )

  const quickContactItems = [
    {
      icon: FiMail,
      label: 'Correo institucional',
      value: displaySettings.institutionalEmail,
      href: `mailto:${displaySettings.institutionalEmail}`,
    },
    {
      icon: FiPhone,
      label: 'Teléfono',
      value: displaySettings.institutionalPhone,
      href: `tel:${displaySettings.institutionalPhone.replace(/\s+/g, '')}`,
    },
    {
      icon: FiMapPin,
      label: 'Ubicación',
      value: displaySettings.address,
    },
    {
      icon: FiClock,
      label: 'Horarios',
      value: displaySettings.businessHoursSummary,
    },
  ]

  return (
    <div className="public-shell py-16 lg:py-24">
      <SectionHeading
        description="Podés escribirnos para orientación institucional, consultas iniciales o coordinación de una primera entrevista."
        eyebrow="Contacto"
        title="Abrimos un canal claro para escuchar, orientar y ordenar el primer paso."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <PanelCard className="bg-white/85" padding="lg" variant="form">
          <ContactForm />
        </PanelCard>

        <div className="grid gap-6">
          <div className="public-media-frame p-4">
            <img alt={media.trustSupport.alt} className="h-64 w-full rounded-[2rem] object-cover" src={media.trustSupport.src} />
          </div>

          <PanelCard className="bg-white/92" padding="lg" variant="form">
            <p className="eyebrow-label">Canales directos</p>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">Hablemos con {displaySettings.centerName}</h3>
            <p className="mt-3 text-sm leading-7 text-[rgba(46,46,46,0.7)]">
              Si preferís otro camino además del formulario, podés escribirnos por WhatsApp, correo o llamarnos.
            </p>

            <div className="mt-6 grid gap-4">
              {quickContactItems.map((item) => {
                const Icon = item.icon

                const content = (
                  <div className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(47,93,115,0.1)] bg-[rgba(247,244,238,0.86)] px-4 py-4 transition-colors hover:bg-[rgba(241,246,245,0.95)]">
                    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)]">
                      <Icon aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.58)]">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[rgba(46,46,46,0.8)]">{item.value}</p>
                    </div>
                  </div>
                )

                if (!item.href) {
                  return <div key={item.label}>{content}</div>
                }

                return (
                  <a key={item.label} href={item.href}>
                    {content}
                  </a>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                className="gap-2"
                href={displaySettings.whatsappUrl}
                rel="noreferrer"
                target="_blank"
                variant="primary"
              >
                <FiMessageCircle aria-hidden="true" className="size-4" />
                Escribir por WhatsApp
              </Button>
              <Button as="a" className="gap-2" href={`mailto:${displaySettings.institutionalEmail}`} variant="outline">
                <FiMail aria-hidden="true" className="size-4" />
                Enviar correo
              </Button>
            </div>
          </PanelCard>

          <PanelCard className="bg-[rgba(247,244,238,0.92)]" variant="muted">
            <p className="eyebrow-label">También podés consultarnos por</p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[rgba(46,46,46,0.74)]">
              <p>Orientación inicial para familias que quieren conocer el espacio.</p>
              <p>Coordinación de una primera entrevista o derivación.</p>
              <p>Consultas administrativas sobre horarios, contacto y funcionamiento general.</p>
            </div>
          </PanelCard>

          <div className="public-media-frame p-4">
            <img alt={media.contactHero.alt} className="h-80 w-full rounded-[2rem] object-cover" src={media.contactHero.src} />
          </div>
        </div>
      </div>
    </div>
  )
}
