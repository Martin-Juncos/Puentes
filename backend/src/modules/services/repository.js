import { prisma } from '../../db/prisma.js'
import { serviceSelect } from '../../utils/recordSelects.js'

export const listServices = (where = {}) =>
  prisma.service.findMany({
    where,
    orderBy: { name: 'asc' },
    select: serviceSelect,
  })

export const getService = (id) =>
  prisma.service.findUnique({
    where: { id },
    select: serviceSelect,
  })

export const createService = (data) =>
  prisma.service.create({
    data,
    select: serviceSelect,
  })

export const updateService = (id, data) =>
  prisma.service.update({
    where: { id },
    data,
    select: serviceSelect,
  })

export const deleteService = (id) =>
  prisma.service.delete({
    where: { id },
    select: serviceSelect,
  })
