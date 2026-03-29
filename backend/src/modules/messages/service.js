import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'
import { stripHtmlToText } from '../../utils/validation.js'

import {
  findMessagingChild,
  getMessageThread,
  listGeneralRecipientCandidates,
  listMessageThreads,
  listRecipientCandidates,
} from './repository.js'

const MESSAGE_PREVIEW_LIMIT = 160

const GENERAL_CONTEXT_LABELS = {
  CONSULTA: 'Consulta',
  REPORTE: 'Reporte',
  INFORMACION: 'Información',
}

const buildMessagePreview = (body) => {
  const text = stripHtmlToText(body)

  if (text.length <= MESSAGE_PREVIEW_LIMIT) {
    return text
  }

  return `${text.slice(0, MESSAGE_PREVIEW_LIMIT - 3).trimEnd()}...`
}

const buildThreadContext = (thread) => ({
  type: thread.contextType,
  label:
    thread.child
      ? `${thread.child.firstName} ${thread.child.lastName}`
      : (GENERAL_CONTEXT_LABELS[thread.contextType] ?? 'General'),
})

const normalizeThreadSummary = (thread) => {
  const lastMessage = thread.messages[0] ?? null

  return {
    id: thread.id,
    contextType: thread.contextType,
    context: buildThreadContext(thread),
    subject: thread.subject,
    status: thread.status,
    priority: thread.priority,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    unreadCount: thread.notifications.length,
    child: thread.child,
    createdByUser: thread.createdByUser,
    participants: thread.participants,
    lastMessageAt: lastMessage?.createdAt ?? thread.createdAt,
    lastMessageAuthor: lastMessage?.authorUser ?? null,
    lastMessagePreview: lastMessage ? buildMessagePreview(lastMessage.body) : '',
  }
}

const normalizeThreadDetail = (thread) => {
  const lastMessage = thread.messages.at(-1) ?? null

  return {
    id: thread.id,
    contextType: thread.contextType,
    context: buildThreadContext(thread),
    subject: thread.subject,
    status: thread.status,
    priority: thread.priority,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    unreadCount: thread.notifications.length,
    child: thread.child,
    createdByUser: thread.createdByUser,
    participants: thread.participants,
    lastMessageAt: lastMessage?.createdAt ?? thread.createdAt,
    lastMessageAuthor: lastMessage?.authorUser ?? null,
    lastMessagePreview: lastMessage ? buildMessagePreview(lastMessage.body) : '',
    messages: thread.messages.map((message) => ({
      ...message,
      bodyPreview: buildMessagePreview(message.body),
    })),
  }
}

const resolveMessagingScope = async (user) => {
  if (user.role !== 'PROFESSIONAL') {
    return { professionalId: null }
  }

  return {
    professionalId: await resolveProfessionalProfileId(user.id),
  }
}

const getAccessibleChild = async (childId, user) => {
  const { professionalId } = await resolveMessagingScope(user)
  const child = await findMessagingChild({
    id: childId,
    ...(professionalId
      ? {
          assignments: {
            some: {
              professionalId,
            },
          },
        }
      : {}),
  })

  if (!child) {
    throw new AppError(404, 'MESSAGE_CHILD_NOT_FOUND', 'No se encontró el caso indicado para iniciar la conversación.')
  }

  return child
}

const getAccessibleThread = async (threadId, user) => {
  const { professionalId } = await resolveMessagingScope(user)
  const thread = await getMessageThread({
    id: threadId,
    userId: user.id,
    professionalId,
  })

  if (!thread) {
    throw new AppError(404, 'MESSAGE_THREAD_NOT_FOUND', 'No se encontró la conversación solicitada.')
  }

  return thread
}

const getThreadContextConfig = async ({ childId, contextType }, user) => {
  if (childId) {
    return {
      child: await getAccessibleChild(childId, user),
      contextType: 'CHILD_CASE',
      eligibleRecipients: await listRecipientCandidates(childId),
    }
  }

  return {
    child: null,
    contextType,
    eligibleRecipients: await listGeneralRecipientCandidates(),
  }
}

export const getMessageRecipients = async ({ childId, contextType }, user) => {
  const context = await getThreadContextConfig({ childId, contextType }, user)

  return context.eligibleRecipients.filter((recipient) => recipient.id !== user.id)
}

export const getMessageThreads = async (filters, user) => {
  const { professionalId } = await resolveMessagingScope(user)
  const threads = await listMessageThreads({
    userId: user.id,
    childId: filters.childId,
    professionalId,
  })

  return threads.map(normalizeThreadSummary)
}

export const getMessageThreadRecord = async (id, user) => normalizeThreadDetail(await getAccessibleThread(id, user))

export const createMessageThreadRecord = async (payload, user) => {
  const context = await getThreadContextConfig(payload, user)
  const eligibleIds = new Set(context.eligibleRecipients.map((recipient) => recipient.id))
  const requestedParticipantIds = [...new Set(payload.participantUserIds)]
  const invalidParticipantIds = requestedParticipantIds.filter(
    (participantId) => participantId !== user.id && !eligibleIds.has(participantId),
  )

  if (invalidParticipantIds.length) {
    throw new AppError(
      400,
      'MESSAGE_PARTICIPANTS_INVALID',
      'Algunos destinatarios no pueden participar en esta conversación.',
    )
  }

  const participantIds = [
    ...new Set([user.id, ...requestedParticipantIds.filter((participantId) => participantId !== user.id)]),
  ]

  if (participantIds.length < 2) {
    throw new AppError(
      400,
      'MESSAGE_PARTICIPANTS_REQUIRED',
      'Debes seleccionar al menos un destinatario para iniciar la conversación.',
    )
  }

  const notificationRecipients = participantIds.filter((participantId) => participantId !== user.id)
  const createdAt = new Date()
  const bodyPreview = buildMessagePreview(payload.initialMessage)
  const notificationTitle = context.child
    ? `Nuevo hilo sobre ${context.child.firstName} ${context.child.lastName}`
    : `Nuevo hilo de ${GENERAL_CONTEXT_LABELS[context.contextType] ?? 'gestión interna'}`

  const threadId = await prisma.$transaction(async (tx) => {
    const thread = await tx.messageThread.create({
      data: {
        childId: context.child?.id ?? null,
        contextType: context.contextType,
        subject: payload.subject,
        createdByUserId: user.id,
        priority: payload.priority,
        participants: {
          create: participantIds.map((participantId) => ({
            userId: participantId,
            lastReadAt: participantId === user.id ? createdAt : null,
          })),
        },
      },
      select: {
        id: true,
      },
    })

    await tx.message.create({
      data: {
        threadId: thread.id,
        authorUserId: user.id,
        body: payload.initialMessage,
        createdAt,
      },
    })

    if (notificationRecipients.length) {
      await tx.notification.createMany({
        data: notificationRecipients.map((participantId) => ({
          userId: participantId,
          type: 'THREAD_ASSIGNED',
          title: notificationTitle,
          bodyPreview,
          threadId: thread.id,
          childId: context.child?.id ?? null,
          actorUserId: user.id,
          createdAt,
        })),
      })
    }

    return thread.id
  })

  return getMessageThreadRecord(threadId, user)
}

export const createMessageRecord = async (threadId, payload, user) => {
  const thread = await getAccessibleThread(threadId, user)

  if (thread.status !== 'OPEN') {
    throw new AppError(409, 'MESSAGE_THREAD_ARCHIVED', 'La conversación está archivada y no admite mensajes nuevos.')
  }

  const recipientIds = thread.participants
    .map((participant) => participant.user.id)
    .filter((participantId) => participantId !== user.id)
  const createdAt = new Date()
  const bodyPreview = buildMessagePreview(payload.body)
  const contextTitle = thread.child
    ? thread.subject
    : `${thread.subject} · ${GENERAL_CONTEXT_LABELS[thread.contextType] ?? 'General'}`

  await prisma.$transaction(async (tx) => {
    await tx.message.create({
      data: {
        threadId,
        authorUserId: user.id,
        body: payload.body,
        createdAt,
      },
    })

    await tx.messageParticipant.update({
      where: {
        threadId_userId: {
          threadId,
          userId: user.id,
        },
      },
      data: {
        lastReadAt: createdAt,
      },
    })

    await tx.messageThread.update({
      where: {
        id: threadId,
      },
      data: {
        updatedAt: createdAt,
      },
    })

    if (recipientIds.length) {
      await tx.notification.createMany({
        data: recipientIds.map((participantId) => ({
          userId: participantId,
          type: 'MESSAGE_NEW',
          title: `Nuevo mensaje en ${contextTitle}`,
          bodyPreview,
          threadId,
          childId: thread.child?.id ?? null,
          actorUserId: user.id,
          createdAt,
        })),
      })
    }
  })

  return getMessageThreadRecord(threadId, user)
}

export const markMessageThreadAsRead = async (threadId, user) => {
  await getAccessibleThread(threadId, user)

  const readAt = new Date()

  await prisma.$transaction([
    prisma.messageParticipant.update({
      where: {
        threadId_userId: {
          threadId,
          userId: user.id,
        },
      },
      data: {
        lastReadAt: readAt,
      },
    }),
    prisma.notification.updateMany({
      where: {
        userId: user.id,
        threadId,
        readAt: null,
      },
      data: {
        readAt,
      },
    }),
  ])

  return {
    success: true,
    readAt,
  }
}
