ALTER TABLE "Session"
  ALTER COLUMN "startsAt" TYPE TIMESTAMPTZ(3) USING "startsAt" AT TIME ZONE 'America/Buenos_Aires',
  ALTER COLUMN "endsAt" TYPE TIMESTAMPTZ(3) USING "endsAt" AT TIME ZONE 'America/Buenos_Aires';
