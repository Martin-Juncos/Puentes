import { prisma } from '../../db/prisma.js'
import { paymentSelect } from '../../utils/recordSelects.js'

export const listPayments = (where = {}) =>
  prisma.paymentRecord.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: paymentSelect,
  })

export const createPayment = (data) =>
  prisma.paymentRecord.create({
    data,
    select: paymentSelect,
  })

export const updatePayment = (id, data) =>
  prisma.paymentRecord.update({
    where: { id },
    data,
    select: paymentSelect,
  })
