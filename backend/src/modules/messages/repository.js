import { prisma } from '../../db/prisma.js'
import {
  childMiniSelect,
  messageThreadDetailSelect,
  messageThreadSummarySelect,
  messagingUserSelect,
} from '../../utils/recordSelects.js'

export const findMessagingChild = (where) =>
  prisma.child.findFirst({
    where,
    select: childMiniSelect,
  })

export const listRecipientCandidates = (childId) =>
  prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: {
        in: ['COORDINATION', 'SECRETARY', 'PROFESSIONAL'],
      },
      OR: [
        {
          role: {
            in: ['COORDINATION', 'SECRETARY'],
          },
        },
        {
          professionalProfile: {
            assignments: {
              some: {
                childId,
              },
            },
          },
        },
      ],
    },
    orderBy: [
      {
        fullName: 'asc',
      },
    ],
    select: messagingUserSelect,
  })

export const listGeneralRecipientCandidates = () =>
  prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: {
        in: ['COORDINATION', 'SECRETARY', 'PROFESSIONAL'],
      },
    },
    orderBy: [
      {
        fullName: 'asc',
      },
    ],
    select: messagingUserSelect,
  })

export const listMessageThreads = ({ userId, childId, professionalId }) =>
  prisma.messageThread.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
      ...(professionalId
        ? {
            OR: [
              {
                contextType: {
                  not: 'CHILD_CASE',
                },
              },
              {
                child: {
                  assignments: {
                    some: {
                      professionalId,
                    },
                  },
                },
              },
            ],
          }
        : {}),
      ...(childId ? { childId } : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    select: messageThreadSummarySelect(userId),
  })

export const getMessageThread = ({ id, userId, professionalId }) =>
  prisma.messageThread.findFirst({
    where: {
      id,
      participants: {
        some: {
          userId,
        },
      },
      ...(professionalId
        ? {
            OR: [
              {
                contextType: {
                  not: 'CHILD_CASE',
                },
              },
              {
                child: {
                  assignments: {
                    some: {
                      professionalId,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
    select: messageThreadDetailSelect(userId),
  })
