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

export const media = {
  logo: {
    src: '/media/logo.png',
    alt: 'Marca institucional de Puentes',
  },
  homeHero: {
    src: '/media/20.jpg',
    alt: 'Espacio de orientacion y acompanamiento familiar en Puentes',
  },
  servicesHero: {
    src: '/media/1.jpg',
    alt: 'Servicios institucionales de Puentes para el trabajo interdisciplinario',
  },
  loginPanel: {
    src: '/media/2.jpg',
    alt: 'Acceso institucional al panel privado de Puentes',
  },
  teamSupport: {
    src: '/media/3.jpg',
    alt: 'Equipo profesional y trabajo articulado en Puentes',
  },
  aboutHero: {
    src: '/media/4.jpg',
    alt: 'Identidad institucional y acompanamiento del centro Puentes',
  },
  newsTeaser: {
    src: '/media/5.jpg',
    alt: 'Espacio preparado para novedades y recursos institucionales',
  },
  trustSupport: {
    src: '/media/6.jpg',
    alt: 'Clima de confianza, escucha y acompanamiento en Puentes',
  },
  aboutSupport: {
    src: '/media/7.jpg',
    alt: 'Trabajo con familias y continuidad institucional en Puentes',
  },
  approachHero: {
    src: '/media/8.jpg',
    alt: 'Modalidad de acompanamiento interdisciplinario en Puentes',
  },
  contactHero: {
    src: '/media/9.jpg',
    alt: 'Espacio de contacto y acompanamiento institucional de Puentes',
  },
  banner1: {
    src: '/media/banner1.png',
    alt: 'Material de acompanamiento y juego terapeutico en Puentes',
  },
  banner2: {
    src: '/media/banner2.png',
    alt: 'Trabajo con familias y acompanamiento institucional en Puentes',
  },
  banner3: {
    src: '/media/banner3.png',
    alt: 'Espacio preparado para orientacion y desarrollo infantil en Puentes',
  },
  banner4: {
    src: '/media/banner4.png',
    alt: 'Recursos de apoyo y seguimiento continuo en Puentes',
  },
  banner5: {
    src: '/media/banner5.png',
    alt: 'Primer acercamiento y acompanamiento institucional en Puentes',
  },
  banner6: {
    src: '/media/banner6.png',
    alt: 'Orientacion compartida con familias y profesionales en Puentes',
  },
  banner7: {
    src: '/media/banner7.png',
    alt: 'Coordinacion del primer paso y trabajo articulado en Puentes',
  },
  aboutInstitutionalTrust: {
    src: '/media/12.jpg',
    alt: 'Presencia institucional confiable y acompanamiento profesional en Puentes',
  },
  aboutFollowUp: {
    src: '/media/14.jpg',
    alt: 'Seguimiento consistente y situado en los procesos de acompanamiento de Puentes',
  },
  approachDevelopmentSupport: {
    src: '/media/16.jpg',
    alt: 'Acompanamiento del desarrollo infantil en Puentes',
  },
  approachInterdisciplinaryWork: {
    src: '/media/17.jpg',
    alt: 'Trabajo interdisciplinario con equipo y familias en Puentes',
  },
  approachOperationalFollowUp: {
    src: '/media/18.jpg',
    alt: 'Seguimiento operativo y profesional claro en Puentes',
  },
  approachInstitutionalCommunication: {
    src: '/media/19.jpg',
    alt: 'Comunicacion institucional cercana y consistente en Puentes',
  },
}

export const getProfessionalPhoto = (fullName) => {
  const normalizedKey = normalizeMediaKey(fullName)

  if (!teamPhotoFileNames.has(normalizedKey)) {
    return null
  }

  return {
    src: `/media/team/${normalizedKey}.jpg`,
    alt: `Retrato profesional de ${fullName} en Puentes`,
  }
}
