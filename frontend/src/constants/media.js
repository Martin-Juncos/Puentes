const teamPhotoFileNames = new Set([
  'anamartinez',
  'camilatevez',
  'carlabenitez',
  'claudiabajale',
  'florenciaperez',
  'gabrieladiaz',
  'julietaherrera',
  'lauramedina',
  'luciabordon',
  'lucianagomez',
  'marianalopez',
  'micaelaruiz',
  'nataliaacosta',
  'paulatorres',
  'rominasilva',
  'sofiaramirez',
  'valeriafernandez',
  'veronicacabrera',
])

const normalizeMediaKey = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

const MEDIA_ROOT = '/media'
const BRANDING_ROOT = `${MEDIA_ROOT}/branding`
const INSTITUTIONAL_ROOT = `${MEDIA_ROOT}/institutional`
const HOME_HIGHLIGHTS_ROOT = `${MEDIA_ROOT}/home/highlights`
const TEAM_ROOT = `${MEDIA_ROOT}/team`

export const media = {
  logo: {
    src: `${BRANDING_ROOT}/logo.png`,
    alt: 'Marca institucional de Puentes',
  },
  homeHero: {
    src: `${INSTITUTIONAL_ROOT}/home-hero.jpg`,
    alt: 'Espacio de orientacion y acompanamiento familiar en Puentes',
  },
  servicesHero: {
    src: `${INSTITUTIONAL_ROOT}/services-hero.jpg`,
    alt: 'Servicios institucionales de Puentes para el trabajo interdisciplinario',
  },
  loginPanel: {
    src: `${INSTITUTIONAL_ROOT}/login-panel.jpg`,
    alt: 'Acceso institucional al panel privado de Puentes',
  },
  teamSupport: {
    src: `${INSTITUTIONAL_ROOT}/team-support.jpg`,
    alt: 'Equipo profesional y trabajo articulado en Puentes',
  },
  aboutHero: {
    src: `${INSTITUTIONAL_ROOT}/about-hero.jpg`,
    alt: 'Identidad institucional y acompanamiento del centro Puentes',
  },
  newsTeaser: {
    src: `${INSTITUTIONAL_ROOT}/news-teaser.jpg`,
    alt: 'Espacio preparado para novedades y recursos institucionales',
  },
  trustSupport: {
    src: `${INSTITUTIONAL_ROOT}/trust-support.jpg`,
    alt: 'Clima de confianza, escucha y acompanamiento en Puentes',
  },
  aboutSupport: {
    src: `${INSTITUTIONAL_ROOT}/about-support.jpg`,
    alt: 'Trabajo con familias y continuidad institucional en Puentes',
  },
  approachHero: {
    src: `${INSTITUTIONAL_ROOT}/approach-hero.jpg`,
    alt: 'Modalidad de acompanamiento interdisciplinario en Puentes',
  },
  contactHero: {
    src: `${INSTITUTIONAL_ROOT}/contact-hero.jpg`,
    alt: 'Espacio de contacto y acompanamiento institucional de Puentes',
  },
  banner1: {
    src: `${HOME_HIGHLIGHTS_ROOT}/interdisciplinary-look.jpg`,
    alt: 'Material de acompanamiento y juego terapeutico en Puentes',
  },
  banner2: {
    src: `${HOME_HIGHLIGHTS_ROOT}/family-work.jpg`,
    alt: 'Trabajo con familias y acompanamiento institucional en Puentes',
  },
  banner3: {
    src: `${HOME_HIGHLIGHTS_ROOT}/initial-guidance.jpg`,
    alt: 'Espacio preparado para orientacion y desarrollo infantil en Puentes',
  },
  banner4: {
    src: `${HOME_HIGHLIGHTS_ROOT}/follow-up-continuity.jpg`,
    alt: 'Recursos de apoyo y seguimiento continuo en Puentes',
  },
  banner5: {
    src: `${HOME_HIGHLIGHTS_ROOT}/share-your-concern.jpg`,
    alt: 'Primer acercamiento y acompanamiento institucional en Puentes',
  },
  banner6: {
    src: `${HOME_HIGHLIGHTS_ROOT}/professional-guidance.jpg`,
    alt: 'Orientacion compartida con familias y profesionales en Puentes',
  },
  banner7: {
    src: `${HOME_HIGHLIGHTS_ROOT}/first-step-coordination.jpg`,
    alt: 'Coordinacion del primer paso y trabajo articulado en Puentes',
  },
  aboutInstitutionalTrust: {
    src: `${INSTITUTIONAL_ROOT}/about-institutional-trust.jpg`,
    alt: 'Presencia institucional confiable y acompanamiento profesional en Puentes',
  },
  aboutFollowUp: {
    src: `${INSTITUTIONAL_ROOT}/about-follow-up.jpg`,
    alt: 'Seguimiento consistente y situado en los procesos de acompanamiento de Puentes',
  },
  approachDevelopmentSupport: {
    src: `${INSTITUTIONAL_ROOT}/approach-development-support.jpg`,
    alt: 'Acompanamiento del desarrollo infantil en Puentes',
  },
  approachInterdisciplinaryWork: {
    src: `${INSTITUTIONAL_ROOT}/approach-interdisciplinary-work.jpg`,
    alt: 'Trabajo interdisciplinario con equipo y familias en Puentes',
  },
  approachOperationalFollowUp: {
    src: `${INSTITUTIONAL_ROOT}/approach-operational-follow-up.jpg`,
    alt: 'Seguimiento operativo y profesional claro en Puentes',
  },
  approachInstitutionalCommunication: {
    src: `${INSTITUTIONAL_ROOT}/approach-institutional-communication.jpg`,
    alt: 'Comunicacion institucional cercana y consistente en Puentes',
  },
}

export const getProfessionalPhoto = (fullName) => {
  const normalizedKey = normalizeMediaKey(fullName)

  if (!teamPhotoFileNames.has(normalizedKey)) {
    return null
  }

  return {
    src: `${TEAM_ROOT}/${normalizedKey}.jpg`,
    alt: `Retrato profesional de ${fullName} en Puentes`,
  }
}
