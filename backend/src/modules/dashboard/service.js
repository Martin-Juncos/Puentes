import { prisma } from '../../db/prisma.js'
import { sessionSelect } from '../../utils/recordSelects.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'

export const getDashboardSummary = async (user) => {
  const professionalId = user.role === 'PROFESSIONAL' ? await resolveProfessionalProfileId(user.id) : undefined
  const sessionWhere = professionalId ? { professionalId } : {}

  const [upcomingSessions, openContacts, pendingPayments] = await Promise.all([
    prisma.session.findMany({
      where: {
        ...sessionWhere,
        startsAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
      take: 6,
      select: sessionSelect,
    }),
    prisma.contactInquiry.count({
      where: {
        status: 'NEW',
      },
    }),
    prisma.paymentRecord.count({
      where: {
        status: 'PENDING',
      },
    }),
  ])

  let summary

  if (professionalId) {
    const assignedChildren = await prisma.child.findMany({
      where: {
        assignments: {
          some: {
            professionalId,
          },
        },
      },
      select: {
        id: true,
        familyId: true,
      },
    })

    const uniqueFamilies = new Set(assignedChildren.map((child) => child.familyId))
    const serviceCount = new Set(upcomingSessions.map((session) => session.service.id))

    summary = {
      children: assignedChildren.length,
      families: uniqueFamilies.size,
      professionals: 1,
      services: serviceCount.size,
      sessions: await prisma.session.count({ where: sessionWhere }),
      openContacts: 0,
      pendingPayments: 0,
    }
  } else {
    const [children, families, professionals, services, sessions] = await Promise.all([
      prisma.child.count(),
      prisma.family.count(),
      prisma.professionalProfile.count(),
      prisma.service.count(),
      prisma.session.count({ where: sessionWhere }),
    ])

    summary = {
      children,
      families,
      professionals,
      services,
      sessions,
      openContacts,
      pendingPayments,
    }
  }

  return {
    summary,
    upcomingSessions,
  }
}
