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
  address: 'Espana 930, Goya, Corrientes',
  institutionalEmail: 'contacto@puentes.local',
  institutionalPhone: '+54 9 3777 679100',
  whatsappUrl: 'https://wa.me/5493777679100?text=Hola%20Puentes',
  businessHoursSummary: 'Lunes a viernes de 8 a 20 h.',
}

const normalizeTextSetting = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed || fallback
}

const sanitizePhoneHref = (value) => value.replace(/[^\d+]/g, '')

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
        // Si la configuracion publica no esta disponible, se mantienen valores de respaldo.
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

  const mapQuery = encodeURIComponent(displaySettings.address)

  const quickContactItems = [
    {
      icon: FiMail,
      label: 'Correo institucional',
      value: displaySettings.institutionalEmail,
      href: `mailto:${displaySettings.institutionalEmail}`,
    },
    {
      icon: FiPhone,
      label: 'Telefono',
      value: displaySettings.institutionalPhone,
      href: `tel:${sanitizePhoneHref(displaySettings.institutionalPhone)}`,
    },
    {
      icon: FiMapPin,
      label: 'Ubicacion',
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
        description="Podes escribirnos para una consulta inicial, orientacion institucional o para coordinar el mejor primer paso segun tu necesidad."
        eyebrow="Contacto"
        title="Un espacio claro para consultar, ordenar la inquietud y elegir el canal mas comodo."
      />

      <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(21rem,0.95fr)]">
        <div className="grid gap-6">
          <PanelCard className="bg-white/95" padding="lg" variant="form">
            <div className="flex flex-col gap-4">
              <div>
                <p className="eyebrow-label">Formulario de contacto</p>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">Contanos en que podemos ayudarte</h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-[rgba(46,46,46,0.74)]">
                  Este formulario esta pensado para consultas iniciales, orientacion institucional y coordinacion de una
                  primera entrevista. Si preferis, tambien podes escribirnos por WhatsApp o correo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[rgba(47,93,115,0.62)]">
                <span className="rounded-full border border-[var(--color-border-soft)] bg-[rgba(247,244,238,0.9)] px-3 py-2">
                  Respuesta institucional
                </span>
                <span className="rounded-full border border-[var(--color-border-soft)] bg-[rgba(247,244,238,0.9)] px-3 py-2">
                  Orientacion inicial
                </span>
                <span className="rounded-full border border-[var(--color-border-soft)] bg-[rgba(247,244,238,0.9)] px-3 py-2">
                  Canales directos
                </span>
              </div>
            </div>

            <div className="mt-8">
              <ContactForm />
            </div>
          </PanelCard>

          <PanelCard className="bg-white/95" padding="lg" variant="form">
            <p className="eyebrow-label">Canales directos</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">Hablemos con {displaySettings.centerName}</h2>
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.74)]">
              Si preferis resolver la consulta por otro canal, te dejamos las vias mas practicas para escribirnos o
              llamarnos sin pasar por el formulario.
            </p>

            <div className="mt-6 grid gap-4">
              {quickContactItems.map((item) => {
                const Icon = item.icon

                const content = (
                  <div className="flex items-start gap-3 rounded-[1.4rem] border border-[rgba(47,93,115,0.1)] bg-[rgba(247,244,238,0.86)] px-4 py-4 transition-colors hover:bg-[rgba(241,246,245,0.95)]">
                    <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-[0_10px_24px_rgba(47,93,115,0.08)]">
                      <Icon aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.58)]">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[rgba(46,46,46,0.82)]">{item.value}</p>
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
        </div>

        <div className="grid gap-6">
          <div className="h-full overflow-hidden rounded-[2rem]">
            <img
              alt={media.contactHero.alt}
              className="h-full min-h-[18rem] w-full object-cover sm:min-h-[22rem]"
              src={media.contactHero.src}
            />
          </div>

          <PanelCard
            className="relative overflow-hidden !border-transparent !bg-[linear-gradient(145deg,rgba(47,93,115,0.98),rgba(36,73,91,0.96),rgba(167,196,181,0.28))] text-white"
            padding="lg"
          >
            <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-white/8 blur-3xl" />
            <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-[rgba(217,140,122,0.16)] blur-3xl" />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Contacto practico</p>
              <h2 className="mt-4 text-3xl font-semibold">Ubicacion y referencia institucional</h2>

              <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 p-3 backdrop-blur">
                <div className="mb-3 flex items-center justify-between gap-3 px-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Direccion</p>
                    <p className="mt-1 text-sm font-medium text-white/88">{displaySettings.address}</p>
                  </div>
                  <a
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-white/78 transition-colors hover:text-white"
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Abrir mapa
                  </a>
                </div>

                <div className="overflow-hidden rounded-[1.25rem] border border-white/10">
                  <iframe
                    allowFullScreen
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`}
                    title={`Mapa de ${displaySettings.centerName}`}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/82">
                <p>Consultas iniciales para familias que quieren conocer el espacio.</p>
                <p>Coordinacion de una primera entrevista o derivacion.</p>
                <p>Informacion institucional sobre horarios, canales y funcionamiento general.</p>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  )
}
