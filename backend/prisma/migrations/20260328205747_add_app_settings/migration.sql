-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "durationMinutes" SET DEFAULT 60;

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL,
    "centerName" TEXT NOT NULL DEFAULT 'Puentes',
    "institutionalEmail" TEXT NOT NULL DEFAULT 'contacto@puentes.local',
    "institutionalPhone" TEXT NOT NULL DEFAULT '+54 11 5555 0000',
    "whatsappUrl" TEXT NOT NULL DEFAULT 'https://wa.me/5491100000000?text=Hola%20Puentes',
    "address" TEXT NOT NULL DEFAULT 'Buenos Aires, Argentina',
    "businessHoursSummary" TEXT NOT NULL DEFAULT 'Lunes a viernes de 8 a 20 h.',
    "defaultServiceDurationMinutes" INTEGER NOT NULL DEFAULT 60,
    "defaultSessionDurationMinutes" INTEGER NOT NULL DEFAULT 45,
    "slotIntervalMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
