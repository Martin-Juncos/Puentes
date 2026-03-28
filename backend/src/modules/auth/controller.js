import { env } from '../../config/env.js'
import { sendSuccess } from '../../utils/response.js'

import { getSessionUser, login } from './service.js'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.cookieSecure || env.isProduction,
  path: '/',
}

export const loginController = async (req, res) => {
  const result = await login(req.body)

  res.cookie(env.cookieName, result.token, cookieOptions)

  return sendSuccess(res, result.user)
}

export const logoutController = async (_req, res) => {
  res.clearCookie(env.cookieName, cookieOptions)
  return sendSuccess(res, { success: true })
}

export const meController = async (req, res) => {
  const user = await getSessionUser(req.user.id)
  return sendSuccess(res, user)
}
