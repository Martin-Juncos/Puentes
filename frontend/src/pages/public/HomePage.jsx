import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiHeart,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiUsers,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'
import {
  homeFallbackServices,
  homeGettingStartedSteps,
  homePracticalSignals,
  homeTeamFallback,
} from '@/constants/siteContent'
import { useAsyncData } from '@/hooks/useAsyncData'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'
import { settingsService } from '@/services/settingsService'

const MotionDiv = motion.div

const fallbackSettings = {
  centerName: 'Puentes',
  address: 'Buenos Aires, Argentina',
  institutionalEmail: 'contacto@puentes.local',
  institutionalPhone: '+54 11 5555 0000',
  whatsappUrl: 'https://wa.me/5491100000000?text=Hola%20Puentes',
  businessHoursSummary: 'Lunes a viernes de 8 a 20 h.',
}

const quickActionCards = [
  {
    title: 'Conocer servicios',
    description: 'Explorá las propuestas del centro y cuáles pueden encajar mejor con tu consulta.',
    to: '/servicios',
    icon: FiCompass,
  },
  {
    title: 'Pedir una orientación inicial',
    description: 'Escribinos para ordenar la inquietud y pensar juntos el mejor primer paso.',
    to: '/contacto',
    icon: FiMessageCircle,
  },
  {
    title: 'Entender la modalidad de acompañamiento',
    description: 'Conocé cómo trabajamos con niños, familias y equipo de forma articulada.',
    to: '/acompanamiento',
    icon: FiHeart,
  },
  {
    title: 'Conocer al equipo',
    description: 'Mirá las disciplinas que forman parte de Puentes y su enfoque de trabajo.',
    to: '/equipo',
    icon: FiUsers,
  },
]

const normalizeTextSetting = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed || fallback
}

const sanitizePhoneHref = (value) => value.replace(/[^\d+]/g, '')

export const HomePage = () => {
  const [settings, setSettings] = useState(fallbackSettings)
  const { data: services } = useAsyncData(() => servicesService.listPublic(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listPublic(), [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const nextSettings = await settingsService.getPublic()
        setSettings((current) => ({
          ...current,
          ...nextSettings,
        }))
      } catch {
        // Se mantienen los valores de respaldo si falla la configuración pública.
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

  const previewServices = useMemo(
    () => (services.length ? services.slice(0, 3) : homeFallbackServices),
    [services],
  )

  const previewProfessionals = useMemo(
    () => (professionals.length ? professionals.slice(0, 3) : []),
    [professionals],
  )

  return (
    <div>
      <section className="public-shell py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center">
            <p className="eyebrow-label">Orientación para familias</p>
            <h1 className="heading-display mt-6 max-w-3xl text-5xl font-semibold leading-none text-[var(--color-primary)] md:text-7xl">
              Cuando algo preocupa, ayuda tener un primer paso claro.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(46,46,46,0.74)]">
              En Puentes acompañamos consultas iniciales, trabajo con familias y procesos interdisciplinarios para que
              cada situación encuentre una orientación posible, cercana y ordenada.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button as={NavLink} className="gap-2" to="/servicios">
                Ver servicios
                <FiArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button as={NavLink} to="/contacto" variant="outline">
                Hacer una consulta
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Orientación inicial', 'Trabajo con familias', 'Equipo interdisciplinario'].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-[rgba(47,93,115,0.12)] bg-white/78 px-4 py-3 text-sm font-medium text-[var(--color-primary)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <MotionDiv
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(160deg,rgba(47,93,115,0.18),rgba(167,196,181,0.12),rgba(217,140,122,0.16))]" />
            <div className="public-media-frame relative p-5">
              <img
                alt={media.homeHero.alt}
                className="h-[26rem] w-full rounded-[2rem] object-cover"
                src={media.homeHero.src}
              />

              <div className="public-media-overlay">
                <p className="eyebrow-label">Primer contacto</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">
                  Te ayudamos a ordenar la consulta
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {homeGettingStartedSteps.map((item) => (
                    <div key={item.step} className="rounded-[1.25rem] bg-[rgba(247,244,238,0.92)] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">
                        {item.step}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {homePracticalSignals.map((item) => (
            <PanelCard className="bg-white/90" key={item.title} variant="metric">
              <div className="flex size-11 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
                <FiCheckCircle aria-hidden="true" className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-[var(--color-primary)]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[rgba(46,46,46,0.72)]">{item.description}</p>
            </PanelCard>
          ))}
        </div>
      </section>

      <section className="public-shell py-10 lg:py-16">
        <SectionHeading
          description="Si ya sabés qué querés resolver, te acercamos un camino rápido para llegar a la información o al contacto correcto."
          eyebrow="Primeras rutas"
          title="¿Qué necesitás hoy?"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {quickActionCards.map((item) => {
            const Icon = item.icon

            return (
              <NavLink key={item.title} to={item.to}>
                <PanelCard className="group h-full bg-white/90 transition-transform hover:-translate-y-1" variant="form">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] transition-colors group-hover:bg-[rgba(47,93,115,0.14)]">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-[var(--color-primary)]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[rgba(46,46,46,0.72)]">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                    Ir ahora
                    <FiArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </PanelCard>
              </NavLink>
            )
          })}
        </div>
      </section>

      <section className="public-shell py-10 lg:py-16">
        <SectionHeading
          description="La idea es que el primer acercamiento no sea confuso: orientamos la consulta y ayudamos a definir un punto de partida."
          eyebrow="Cómo empezar"
          title="Un proceso simple para dar el primer paso."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {homeGettingStartedSteps.map((item) => (
            <PanelCard className="bg-white/88" key={item.step} variant="form">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">{item.step}</p>
              <h2 className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.74)]">{item.description}</p>
            </PanelCard>
          ))}
        </div>
      </section>

      <section className="public-shell py-10 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            description="Mostramos algunos servicios activos para ayudarte a ubicar rápidamente por dónde puede comenzar la orientación."
            eyebrow="Servicios"
            title="Una propuesta pensada para orientar, acompañar y articular."
          />

          <Button as={NavLink} className="gap-2 self-start" to="/servicios" variant="outline">
            Ver todos los servicios
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {previewServices.map((service) => (
            <PanelCard className="bg-white/90" key={service.name} variant="form">
              <div className="h-2 w-20 rounded-full" style={{ backgroundColor: service.colorTag || '#2F5D73' }} />
              <h2 className="mt-5 text-2xl font-semibold text-[var(--color-primary)]">{service.name}</h2>
              <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.74)]">{service.description}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">
                Duración de referencia: {service.durationMinutes} min
              </p>
            </PanelCard>
          ))}
        </div>
      </section>

      <section className="public-shell py-10 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            description="El equipo se presenta como un soporte cercano y articulado, no como intervenciones aisladas."
            eyebrow="Equipo"
            title="Profesionales que trabajan con una mirada compartida."
          />

          <Button as={NavLink} className="gap-2 self-start" to="/equipo" variant="outline">
            Conocer al equipo
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>

        {previewProfessionals.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {previewProfessionals.map((professional, index) => (
              <PanelCard className="bg-white/90" key={professional.id} variant="form">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] text-2xl font-bold text-white"
                  style={{ backgroundColor: professional.calendarColor || (index % 2 === 0 ? '#2F5D73' : '#A7C4B5') }}
                >
                  {professional.user.fullName.charAt(0)}
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">{professional.discipline}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{professional.user.fullName}</h2>
                <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.74)]">
                  {professional.bio || 'Perfil profesional disponible para ampliar desde la página de equipo.'}
                </p>
              </PanelCard>
            ))}
          </div>
        ) : (
          <PanelCard className="mt-10 bg-white/92" padding="lg" variant="form">
            <p className="eyebrow-label">{homeTeamFallback.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">{homeTeamFallback.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(46,46,46,0.74)]">{homeTeamFallback.description}</p>
            <Button as={NavLink} className="mt-6 gap-2" to="/equipo" variant="outline">
              Ir a equipo
              <FiArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </PanelCard>
        )}
      </section>

      <section className="public-shell pb-20 pt-10 lg:pb-24 lg:pt-16">
        <PanelCard
          className="relative overflow-hidden !border-transparent !bg-[linear-gradient(145deg,rgba(47,93,115,0.98),rgba(36,73,91,0.96),rgba(167,196,181,0.3))] text-white"
          padding="lg"
        >
          <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-[rgba(217,140,122,0.16)] blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">Contacto práctico</p>
              <h2 className="mt-4 text-4xl font-semibold">
                Si querés dar el primer paso, te respondemos por el canal que te quede mejor.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">
                Podés escribirnos por formulario, WhatsApp, correo o teléfono. Lo importante es que la consulta no
                quede sin orientación.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-white/72">
                <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2">Respuesta institucional</span>
                <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2">Canales directos</span>
                <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2">Horarios visibles</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button as={NavLink} className="gap-2" to="/contacto" variant="secondary">
                  Hacer una consulta
                  <FiArrowRight aria-hidden="true" className="size-4" />
                </Button>
                <Button
                  as="a"
                  className="gap-2"
                  href={displaySettings.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="contrast"
                >
                  <FiMessageCircle aria-hidden="true" className="size-4" />
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="public-media-frame border-white/10 bg-white/10 p-3 shadow-none">
                <img alt={media.trustSupport.alt} className="h-40 w-full rounded-[1.5rem] object-cover" src={media.trustSupport.src} />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/12 px-5 py-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <FiMail aria-hidden="true" className="mt-1 size-4 text-white/80" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Correo</p>
                    <a className="mt-1 block text-sm leading-6 text-white/90" href={`mailto:${displaySettings.institutionalEmail}`}>
                      {displaySettings.institutionalEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/12 px-5 py-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <FiPhone aria-hidden="true" className="mt-1 size-4 text-white/80" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Teléfono</p>
                    <a className="mt-1 block text-sm leading-6 text-white/90" href={`tel:${sanitizePhoneHref(displaySettings.institutionalPhone)}`}>
                      {displaySettings.institutionalPhone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/12 px-5 py-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <FiClock aria-hidden="true" className="mt-1 size-4 text-white/80" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Horarios</p>
                    <p className="mt-1 text-sm leading-6 text-white/90">{displaySettings.businessHoursSummary}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/12 px-5 py-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <FiMapPin aria-hidden="true" className="mt-1 size-4 text-white/80" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Ubicación</p>
                    <p className="mt-1 text-sm leading-6 text-white/90">{displaySettings.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>
      </section>
    </div>
  )
}
