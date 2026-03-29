-- CreateEnum
CREATE TYPE "MessageThreadContextType" AS ENUM ('CHILD_CASE', 'CONSULTA', 'REPORTE', 'INFORMACION');

-- AlterTable
ALTER TABLE "MessageThread" ADD COLUMN "contextType" "MessageThreadContextType" NOT NULL DEFAULT 'CHILD_CASE';

-- AlterTable
ALTER TABLE "MessageThread" ALTER COLUMN "childId" DROP NOT NULL;
