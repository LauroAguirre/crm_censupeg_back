-- AlterTable
ALTER TABLE "contato_candidatos" ADD COLUMN     "id_matricula" INTEGER;

-- AddForeignKey
ALTER TABLE "contato_candidatos" ADD CONSTRAINT "contato_candidatos_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matriculas"("id_matricula") ON DELETE SET NULL ON UPDATE CASCADE;
