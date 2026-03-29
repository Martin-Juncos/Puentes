ALTER TABLE "FollowUpNote"
ADD COLUMN "followUpDate" TIMESTAMP(3),
ADD COLUMN "summary" TEXT;

UPDATE "FollowUpNote" AS "followUp"
SET "followUpDate" = COALESCE("session"."startsAt", "followUp"."createdAt")
FROM "Session" AS "session"
WHERE "followUp"."sessionId" = "session"."id";

UPDATE "FollowUpNote"
SET "followUpDate" = "createdAt"
WHERE "followUpDate" IS NULL;

ALTER TABLE "FollowUpNote"
ALTER COLUMN "followUpDate" SET NOT NULL;

CREATE INDEX "FollowUpNote_followUpDate_idx" ON "FollowUpNote"("followUpDate");
