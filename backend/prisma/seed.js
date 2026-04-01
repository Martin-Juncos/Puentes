import { randomBytes } from 'node:crypto'

import bcrypt from 'bcryptjs'

import { PrismaClient } from '@prisma/client'

import { DEFAULT_SERVICES_CATALOG } from '../src/config/defaultServicesCatalog.js'
import { DEFAULT_APP_SETTINGS } from '../src/config/defaultAppSettings.js'
import { loadEnv } from '../src/config/loadEnv.js'

loadEnv()

const prisma = new PrismaClient()
const allowedSeedHostnames = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '[::1]',
  'host.docker.internal',
])
const privateIpv4Pattern =
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})$/
const defaultSeedAdminEmail = 'admin@puentes.local'

const buildDate = (dayOffset, hour, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date
}

const getSeedEnv = (name, fallback = '') => {
  const value = process.env[name]?.trim()
  return value || fallback
}

const generateDemoPassword = () => randomBytes(12).toString('base64url')

const isSafeSeedHost = (hostname) =>
  allowedSeedHostnames.has(hostname) ||
  privateIpv4Pattern.test(hostname) ||
  hostname.endsWith('.local') ||
  !hostname.includes('.')

const canSeedDatabaseSafely = (databaseUrl) => {
  try {
    const url = new URL(databaseUrl)

    if (url.protocol === 'file:') {
      return true
    }

    return isSafeSeedHost(url.hostname)
  } catch {
    return false
  }
}

const assertSeedSafety = () => {
  const nodeEnv = getSeedEnv('NODE_ENV', 'development').toLowerCase()
  const databaseUrl = getSeedEnv('DATABASE_URL')
  const allowRemoteSeed = getSeedEnv('SEED_ALLOW_REMOTE') === 'true'

  if (nodeEnv === 'production') {
    throw new Error('Seed bloqueado: no se permite correr datos demo con NODE_ENV=production.')
  }

  if (!databaseUrl) {
    throw new Error('Seed bloqueado: DATABASE_URL no esta configurada.')
  }

  if (!allowRemoteSeed && !canSeedDatabaseSafely(databaseUrl)) {
    throw new Error(
      'Seed bloqueado: DATABASE_URL no parece apuntar a una base local o descartable. Usa SEED_ALLOW_REMOTE=true solo si es intencional.',
    )
  }
}

const main = async () => {
  assertSeedSafety()

  const adminDemoEmail = getSeedEnv('SEED_ADMIN_EMAIL', defaultSeedAdminEmail)
  const adminDemoPassword = getSeedEnv('SEED_ADMIN_PASSWORD') || generateDemoPassword()
  const defaultDemoPassword = getSeedEnv('SEED_DEFAULT_PASSWORD') || generateDemoPassword()
  const isAdminPasswordGenerated = !getSeedEnv('SEED_ADMIN_PASSWORD')
  const isDefaultPasswordGenerated = !getSeedEnv('SEED_DEFAULT_PASSWORD')

  const adminPasswordHash = await bcrypt.hash(adminDemoPassword, 10)
  const defaultPasswordHash = await bcrypt.hash(defaultDemoPassword, 10)

  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.messageParticipant.deleteMany()
  await prisma.messageThread.deleteMany()
  await prisma.paymentRecord.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.followUpNote.deleteMany()
  await prisma.session.deleteMany()
  await prisma.childProfessionalAssignment.deleteMany()
  await prisma.child.deleteMany()
  await prisma.family.deleteMany()
  await prisma.professionalProfile.deleteMany()
  await prisma.service.deleteMany()
  await prisma.contactInquiry.deleteMany()
  await prisma.appSettings.deleteMany()
  await prisma.user.deleteMany()

  await prisma.appSettings.create({
    data: DEFAULT_APP_SETTINGS,
  })

  const users = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'Valeria Admin',
        email: adminDemoEmail,
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        phone: '+54 11 5555 0101',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Lucía Coordinación',
        email: 'coordinacion@puentes.local',
        passwordHash: defaultPasswordHash,
        role: 'COORDINATION',
        phone: '+54 11 5555 0102',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Marina Secretaría',
        email: 'secretaria@puentes.local',
        passwordHash: defaultPasswordHash,
        role: 'SECRETARY',
        phone: '+54 11 5555 0103',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Camila Psicopedagogía',
        email: 'profesional@puentes.local',
        passwordHash: defaultPasswordHash,
        role: 'PROFESSIONAL',
        phone: '+54 11 5555 0104',
      },
    }),
  ])

  const [adminUser, coordinationUser, secretaryUser, professionalUser] = users

  const [coordinationProfile, professionalProfile] = await Promise.all([
    prisma.professionalProfile.create({
      data: {
        userId: coordinationUser.id,
        discipline: 'Coordinación interdisciplinaria',
        bio: 'Supervisión de abordajes y articulación institucional.',
        calendarColor: '#2F5D73',
      },
    }),
    prisma.professionalProfile.create({
      data: {
        userId: professionalUser.id,
        discipline: 'Psicopedagogía',
        bio: 'Acompañamiento del desarrollo y trabajo con familias.',
        calendarColor: '#A7C4B5',
      },
    }),
  ])

  await prisma.service.createMany({
    data: DEFAULT_SERVICES_CATALOG,
  })

  const seededServices = await prisma.service.findMany({
    where: {
      name: {
        in: [
          'Evaluación interdisciplinaria',
          'Acompañamiento psicopedagógico',
          'Orientación a familias',
        ],
      },
    },
  })

  const serviceOne = seededServices.find((service) => service.name === 'Evaluación interdisciplinaria')
  const serviceTwo = seededServices.find((service) => service.name === 'Acompañamiento psicopedagógico')
  const serviceThree = seededServices.find((service) => service.name === 'Orientación a familias')

  const family = await prisma.family.create({
    data: {
      displayName: 'Familia Pérez',
      primaryContactName: 'Ana Pérez',
      primaryContactRelationship: 'Madre',
      phone: '+54 11 5555 0201',
      email: 'ana.perez@familia.local',
      address: 'Belgrano, Buenos Aires',
      notes: 'Consulta inicial por organización escolar y hábitos.',
    },
  })

  const child = await prisma.child.create({
    data: {
      firstName: 'Tomás',
      lastName: 'Pérez',
      birthDate: new Date('2019-05-18T00:00:00.000Z'),
      familyId: family.id,
      schoolName: 'Colegio del Puente',
      notes: 'Requiere seguimiento interdisciplinario básico.',
    },
  })

  await prisma.childProfessionalAssignment.create({
    data: {
      childId: child.id,
      professionalId: professionalProfile.id,
      serviceId: serviceTwo.id,
      assignedByUserId: secretaryUser.id,
      notes: 'Asignación inicial para acompañamiento semanal.',
    },
  })

  const sessionOne = await prisma.session.create({
    data: {
      childId: child.id,
      professionalId: professionalProfile.id,
      serviceId: serviceTwo.id,
      createdByUserId: secretaryUser.id,
      startsAt: buildDate(1, 10),
      endsAt: buildDate(1, 10, 45),
      adminNotes: 'Primera sesión del plan.',
    },
  })

  await prisma.session.create({
    data: {
      childId: child.id,
      professionalId: coordinationProfile.id,
      serviceId: serviceThree.id,
      createdByUserId: coordinationUser.id,
      startsAt: buildDate(2, 12),
      endsAt: buildDate(2, 12, 50),
      adminNotes: 'Encuentro con familia.',
    },
  })

  await prisma.attendanceRecord.create({
    data: {
      sessionId: sessionOne.id,
      status: 'PRESENT',
      registeredByUserId: secretaryUser.id,
      notes: 'Asistencia confirmada en tiempo.',
    },
  })

  await prisma.paymentRecord.create({
    data: {
      childId: child.id,
      familyId: family.id,
      sessionId: sessionOne.id,
      amount: 22000,
      status: 'PENDING',
      dueDate: buildDate(7, 18),
      recordedByUserId: secretaryUser.id,
      notes: 'Cobro correspondiente a abril.',
    },
  })

  await prisma.followUpNote.create({
    data: {
      childId: child.id,
      professionalId: professionalProfile.id,
      authorUserId: professionalUser.id,
      sessionId: sessionOne.id,
      followUpDate: sessionOne.startsAt,
      summary: 'Primer registro del proceso y acuerdos iniciales.',
      title: 'Observación inicial',
      note: 'Buena disposición al vínculo. Se acuerdan objetivos de trabajo con la familia.',
    },
  })

  await prisma.contactInquiry.create({
    data: {
      fullName: 'María González',
      email: 'consulta@externa.local',
      phone: '+54 11 5555 0301',
      message: 'Quisiera conocer más sobre la modalidad de evaluación y orientación.',
    },
  })

  console.log('Seed completado.')
  console.log('Usuarios demo:')
  console.log(`- ${adminDemoEmail} / ${adminDemoPassword} (${adminUser.role})`)
  console.log(`- coordinacion@puentes.local / ${defaultDemoPassword} (${coordinationUser.role})`)
  console.log(`- secretaria@puentes.local / ${defaultDemoPassword} (${secretaryUser.role})`)
  console.log(`- profesional@puentes.local / ${defaultDemoPassword} (${professionalUser.role})`)
  if (isAdminPasswordGenerated || isDefaultPasswordGenerated) {
    console.log('- Las passwords fueron generadas en esta corrida. Si queres credenciales estables, defini SEED_ADMIN_PASSWORD y/o SEED_DEFAULT_PASSWORD.')
  }
  console.log(`- Servicio institucional destacado: ${serviceOne?.name ?? 'No encontrado'}`)
  console.log(`- Servicio operativo destacado: ${serviceThree?.name ?? 'No encontrado'}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
