import { prisma } from '../../db/prisma.js'
import { attendanceSelect } from '../../utils/recordSelects.js'

export const listAttendances = (where = {}) =>
  prisma.attendanceRecord.findMany({
    where,
    orderBy: {
      registeredAt: 'desc',
    },
    select: attendanceSelect,
  })

export const upsertAttendance = ({ sessionId, ...data }) =>
  prisma.attendanceRecord.upsert({
    where: { sessionId },
    update: data,
    create: {
      sessionId,
      ...data,
    },
    select: attendanceSelect,
  })
