import { media } from '@/constants/media'

export const homePracticalSignals = [
  {
    title: 'Mirada interdisciplinaria',
    description: 'Evaluamos cada situación desde una lectura amplia, con articulación entre disciplinas.',
    image: media.teamSupport.src,
    imageAlt: media.teamSupport.alt,
  },
  {
    title: 'Trabajo con familias',
    description: 'El acompañamiento incluye escucha, orientación y construcción conjunta con adultos referentes.',
    image: media.aboutSupport.src,
    imageAlt: media.aboutSupport.alt,
  },
  {
    title: 'Orientación inicial',
    description: 'Ayudamos a ordenar la consulta y a definir cuál puede ser el mejor primer paso.',
    image: media.homeHero.src,
    imageAlt: media.homeHero.alt,
  },
  {
    title: 'Seguimiento con continuidad',
    description: 'Buscamos que cada proceso tenga sostén, claridad y una comunicación consistente.',
    image: media.trustSupport.src,
    imageAlt: media.trustSupport.alt,
  },
]

export const homeGettingStartedSteps = [
  {
    step: '01',
    badgeLabel: 'Paso 01',
    title: 'Nos contás tu inquietud',
    description: 'Podés escribirnos por el formulario, WhatsApp o correo para hacer una primera consulta.',
    image: media.contactHero.src,
    imageAlt: media.contactHero.alt,
  },
  {
    step: '02',
    badgeLabel: 'Paso 02',
    title: 'Te orientamos',
    description: 'Revisamos tu consulta y te ayudamos a identificar el servicio o modalidad más adecuada.',
    image: media.aboutSupport.src,
    imageAlt: media.aboutSupport.alt,
  },
  {
    step: '03',
    badgeLabel: 'Paso 03',
    title: 'Coordinamos el primer paso',
    description: 'Definimos una entrevista inicial, una orientación específica o la derivación correspondiente.',
    image: media.approachHero.src,
    imageAlt: media.approachHero.alt,
  },
]

export const homeFallbackServices = [
  {
    name: 'Orientación inicial',
    description: 'Primer espacio para ordenar la consulta, conocer la situación y pensar el mejor comienzo.',
    durationMinutes: 60,
    colorTag: '#2F5D73',
  },
  {
    name: 'Acompañamiento interdisciplinario',
    description: 'Procesos sostenidos de trabajo con niños, familias y equipo, según cada necesidad.',
    durationMinutes: 45,
    colorTag: '#A7C4B5',
  },
  {
    name: 'Trabajo con familias',
    description: 'Encuentros para acompañar decisiones, fortalecer recursos y articular el proceso de cuidado.',
    durationMinutes: 60,
    colorTag: '#D98C7A',
  },
]

export const homeTeamFallback = {
  eyebrow: 'Equipo',
  title: 'Una red profesional que trabaja de forma articulada.',
  description:
    'Puentes integra disciplinas y coordinación institucional para acompañar procesos con continuidad, cercanía y criterio clínico.',
}

export const approachPillars = [
  'Acompañamiento del desarrollo infantil',
  'Trabajo interdisciplinario con equipo y familias',
  'Seguimiento operativo y profesional claro',
  'Comunicación institucional cercana y consistente',
]
