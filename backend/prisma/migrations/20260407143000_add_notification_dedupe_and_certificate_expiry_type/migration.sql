ALTER TYPE "NotificationType" ADD VALUE 'CHILD_CERTIFICATE_EXPIRING';

ALTER TABLE "Notification"
ADD COLUMN "dedupeKey" TEXT;

CREATE UNIQUE INDEX "Notification_userId_dedupeKey_key" ON "Notification"("userId", "dedupeKey");
