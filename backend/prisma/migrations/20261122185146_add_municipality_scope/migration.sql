-- AlterTable
ALTER TABLE "budget_audit_logs" ADD COLUMN     "municipality" TEXT NOT NULL DEFAULT 'Bhimdatta Municipality';

-- AlterTable
ALTER TABLE "budget_items" ADD COLUMN     "municipality" TEXT NOT NULL DEFAULT 'Bhimdatta Municipality';

-- AlterTable
ALTER TABLE "complaints" ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "municipality" TEXT NOT NULL DEFAULT 'Bhimdatta Municipality';
