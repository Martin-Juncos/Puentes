import { loadEnv } from '../src/config/loadEnv.js'

loadEnv()

const [{ prisma }, { syncExpiringCertificateNotifications }] = await Promise.all([
  import('../src/db/prisma.js'),
  import('../src/modules/notifications/certificateExpiryService.js'),
])

try {
  const result = await syncExpiringCertificateNotifications()

  console.log(
    JSON.stringify(
      {
        job: 'certificate-expiry-notifications',
        ...result,
      },
      null,
      2,
    ),
  )
} catch (error) {
  console.error('CERTIFICATE_EXPIRY_NOTIFICATIONS_FAILED', error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
