import { Router } from 'express'

import { authRouter } from '../modules/auth/routes.js'
import { contactsRouter } from '../modules/contacts/routes.js'
import { usersRouter } from '../modules/users/routes.js'
import { professionalsRouter } from '../modules/professionals/routes.js'
import { servicesRouter } from '../modules/services/routes.js'
import { familiesRouter } from '../modules/families/routes.js'
import { childrenRouter } from '../modules/children/routes.js'
import { sessionsRouter } from '../modules/sessions/routes.js'
import { attendancesRouter } from '../modules/attendances/routes.js'
import { paymentsRouter } from '../modules/payments/routes.js'
import { followUpsRouter } from '../modules/follow-ups/routes.js'
import { dashboardRouter } from '../modules/dashboard/routes.js'
import { settingsRouter } from '../modules/settings/routes.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok' } })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/contacts', contactsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/professionals', professionalsRouter)
apiRouter.use('/services', servicesRouter)
apiRouter.use('/families', familiesRouter)
apiRouter.use('/children', childrenRouter)
apiRouter.use('/sessions', sessionsRouter)
apiRouter.use('/attendances', attendancesRouter)
apiRouter.use('/payments', paymentsRouter)
apiRouter.use('/follow-ups', followUpsRouter)
apiRouter.use('/dashboard', dashboardRouter)
apiRouter.use('/settings', settingsRouter)
