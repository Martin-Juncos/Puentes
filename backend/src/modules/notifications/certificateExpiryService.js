import { prisma } from '../../db/prisma.js'

const CERTIFICATE_EXPIRY_WINDOW_DAYS = 90

const startOfUtcDay = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))

const endOfUtcDay = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))

const addUtcDays = (date, days) => {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

const formatUtcDateKey = (date) => date.toISOString().slice(0, 10)

const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)

export const buildCertificateExpiryDedupeKey = (childId, expiresAt) =>
  `certificate-expiry:${childId}:${formatUtcDateKey(expiresAt)}`

const buildNotificationPayload = ({ child, expiresAt, recipientUserId, createdAt }) => ({
  userId: recipientUserId,
  type: 'CHILD_CERTIFICATE_EXPIRING',
  title: 'Certificado proximo a vencer',
  bodyPreview: `El certificado de ${child.firstName} ${child.lastName} vence el ${formatDisplayDate(expiresAt)}.`,
  dedupeKey: buildCertificateExpiryDedupeKey(child.id, expiresAt),
  childId: child.id,
  actorUserId: null,
  createdAt,
})

export const listChildrenWithCertificateExpiringSoon = async (referenceDate = new Date()) => {
  const rangeStart = startOfUtcDay(referenceDate)
  const rangeEnd = endOfUtcDay(addUtcDays(rangeStart, CERTIFICATE_EXPIRY_WINDOW_DAYS))

  return prisma.child.findMany({
    where: {
      status: {
        in: ['ACTIVE', 'PAUSED'],
      },
      disabilityCertificateExpiresAt: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    },
    orderBy: [
      {
        disabilityCertificateExpiresAt: 'asc',
      },
      {
        lastName: 'asc',
      },
      {
        firstName: 'asc',
      },
    ],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      disabilityCertificateExpiresAt: true,
      assignments: {
        select: {
          professional: {
            select: {
              user: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

const listOperationalRecipients = () =>
  prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: {
        in: ['COORDINATION', 'SECRETARY'],
      },
    },
    orderBy: [
      {
        fullName: 'asc',
      },
    ],
    select: {
      id: true,
    },
  })

export const syncExpiringCertificateNotifications = async (referenceDate = new Date()) => {
  const [children, operationalRecipients] = await Promise.all([
    listChildrenWithCertificateExpiringSoon(referenceDate),
    listOperationalRecipients(),
  ])

  const operationalRecipientIds = operationalRecipients.map((recipient) => recipient.id)
  const createdAt = new Date()
  const notifications = children.flatMap((child) => {
    if (!child.disabilityCertificateExpiresAt) {
      return []
    }

    const recipientIds = new Set(operationalRecipientIds)

    child.assignments.forEach((assignment) => {
      const professionalUser = assignment.professional.user

      if (professionalUser?.status === 'ACTIVE') {
        recipientIds.add(professionalUser.id)
      }
    })

    return Array.from(recipientIds).map((recipientUserId) =>
      buildNotificationPayload({
        child,
        expiresAt: child.disabilityCertificateExpiresAt,
        recipientUserId,
        createdAt,
      }),
    )
  })

  if (!notifications.length) {
    return {
      scannedChildren: children.length,
      queuedNotifications: 0,
      createdNotifications: 0,
    }
  }

  const result = await prisma.notification.createMany({
    data: notifications,
    skipDuplicates: true,
  })

  return {
    scannedChildren: children.length,
    queuedNotifications: notifications.length,
    createdNotifications: result.count,
  }
}
