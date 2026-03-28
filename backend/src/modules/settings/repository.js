import { prisma } from '../../db/prisma.js'

export const settingsSelect = {
  id: true,
  centerName: true,
  institutionalEmail: true,
  institutionalPhone: true,
  whatsappUrl: true,
  address: true,
  businessHoursSummary: true,
  defaultServiceDurationMinutes: true,
  defaultSessionDurationMinutes: true,
  slotIntervalMinutes: true,
  updatedAt: true,
}

export const upsertSettings = (id, createData, updateData = {}) =>
  prisma.appSettings.upsert({
    where: { id },
    create: createData,
    update: updateData,
    select: settingsSelect,
  })
