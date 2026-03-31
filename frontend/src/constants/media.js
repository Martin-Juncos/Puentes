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
    src: '/media/0.jpg',
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
