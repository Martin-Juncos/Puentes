import { prisma } from '../../db/prisma.js'
import { childSelect } from '../../utils/recordSelects.js'

export const listChildren = (where = {}) =>
  prisma.child.findMany({
    where,
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: childSelect,
  })

export const getChild = (id) =>
  prisma.child.findUnique({
    where: { id },
    select: childSelect,
  })

export const createChild = (data) =>
  prisma.child.create({
    data,
    select: childSelect,
  })

export const updateChild = (id, data) =>
  prisma.child.update({
    where: { id },
    data,
    select: childSelect,
  })

export const deleteChild = (id) =>
  prisma.child.delete({
    where: { id },
    select: childSelect,
  })

export const upsertAssignment = ({ childId, ...data }) =>
  prisma.childProfessionalAssignment.create({
    data: {
      childId,
      ...data,
    },
  })

export const deleteAssignmentsByChild = (childId) =>
  prisma.childProfessionalAssignment.deleteMany({
    where: { childId },
  })
