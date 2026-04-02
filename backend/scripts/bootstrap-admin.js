import bcrypt from 'bcryptjs'

import { PrismaClient } from '@prisma/client'

import { loadEnv } from '../src/config/loadEnv.js'

loadEnv()

const prisma = new PrismaClient()

const getRequiredEnv = (name) => {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Falta la variable obligatoria ${name}.`)
  }

  return value
}

const normalizeEmail = (value) => value.trim().toLowerCase()

const bootstrapAdmin = async () => {
  getRequiredEnv('DATABASE_URL')
  const fullName = getRequiredEnv('BOOTSTRAP_ADMIN_FULL_NAME')
  const email = normalizeEmail(getRequiredEnv('BOOTSTRAP_ADMIN_EMAIL'))
  const password = getRequiredEnv('BOOTSTRAP_ADMIN_PASSWORD')

  if (password.length < 6) {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD debe tener al menos 6 caracteres.')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  if (existingUser) {
    throw new Error(
      `Bootstrap cancelado: ya existe un usuario con el email ${existingUser.email} y rol ${existingUser.role}.`,
    )
  }

  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      email: true,
    },
  })

  if (existingAdmin) {
    throw new Error(
      `Bootstrap cancelado: ya existe un usuario ADMIN (${existingAdmin.email}). Usa el panel para gestionar usuarios adicionales.`,
    )
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const createdAdmin = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })

  console.log('ADMIN inicial creado correctamente.')
  console.log(`ID: ${createdAdmin.id}`)
  console.log(`Nombre: ${createdAdmin.fullName}`)
  console.log(`Email: ${createdAdmin.email}`)
  console.log(`Rol: ${createdAdmin.role}`)
  console.log(`Estado: ${createdAdmin.status}`)
}

try {
  await bootstrapAdmin()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
