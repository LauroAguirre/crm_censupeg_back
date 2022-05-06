-- AlterTable
ALTER TABLE "candidatos" ADD COLUMN     "id_campanha" TEXT;

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_campanha_fkey" FOREIGN KEY ("id_campanha") REFERENCES "Campanhas"("id_campanha") ON DELETE SET NULL ON UPDATE CASCADE;
