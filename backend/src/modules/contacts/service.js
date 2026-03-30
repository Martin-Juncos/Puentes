import { Resend } from 'resend'

import { env } from '../../config/env.js'
import { prisma } from '../../db/prisma.js'
import { contactInquirySelect } from '../../utils/recordSelects.js'

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null

const buildContactEmailText = ({ fullName, email, phone, message }) =>
  `Nombre: ${fullName}\nEmail: ${email}\nTelefono: ${phone ?? '-'}\n\n${message}`

const sendContactEmail = async (payload) => {
  if (!resend) {
    console.warn('CONTACT_EMAIL_SKIPPED', 'RESEND_API_KEY no está configurada.')
    return
  }

  const response = await resend.emails.send({
    from: env.resendFrom,
    to: [env.contactReceiver],
    replyTo: payload.email,
    subject: `Nueva consulta institucional de ${payload.fullName}`,
    text: buildContactEmailText(payload),
  })

  if (response.error) {
    throw new Error(response.error.message)
  }
}

export const createContactInquiry = async (payload) => {
  const inquiry = await prisma.contactInquiry.create({
    data: payload,
    select: contactInquirySelect,
  })

  try {
    await sendContactEmail(payload)
  } catch (error) {
    console.error('CONTACT_EMAIL_DELIVERY_FAILED', error)
  }

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
