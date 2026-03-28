import nodemailer from 'nodemailer'

import { env } from '../../config/env.js'
import { prisma } from '../../db/prisma.js'
import { contactInquirySelect } from '../../utils/recordSelects.js'

const transporter =
  env.smtpHost && env.smtpUser
    ? nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      })
    : nodemailer.createTransport({
        jsonTransport: true,
      })

const sendContactEmail = async ({ fullName, email, phone, message }) => {
  await transporter.sendMail({
    from: env.smtpFrom,
    to: env.contactReceiver,
    replyTo: email,
    subject: `Nueva consulta institucional de ${fullName}`,
    text: `Nombre: ${fullName}\nEmail: ${email}\nTelefono: ${phone ?? '-'}\n\n${message}`,
  })
}

export const createContactInquiry = async (payload) => {
  const inquiry = await prisma.contactInquiry.create({
    data: payload,
    select: contactInquirySelect,
  })

  await sendContactEmail(payload)

  return inquiry
}

export const listContactInquiries = async (status) =>
  prisma.contactInquiry.findMany({
    where: {
      status,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: contactInquirySelect,
  })
