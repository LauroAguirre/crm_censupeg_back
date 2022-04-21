/*
  Warnings:

  - You are about to drop the column `areas_interesse` on the `contato_candidatos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contato_candidatos" DROP COLUMN "areas_interesse",
ADD COLUMN     "comentarios_proximo_contato" TEXT,
ADD COLUMN     "edital" TEXT;

-- AlterTable
ALTER TABLE "contato_empresas" ADD COLUMN     "comentarios_proximo_contato" TEXT;

-- AlterTable
ALTER TABLE "cursos_interesse" ADD COLUMN     "contatoCandidatosIdCandidato" TEXT,
ADD COLUMN     "contatoCandidatosIdFuncionario" TEXT;

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_contatoCandidatosIdCandidato_contatoCandi_fkey" FOREIGN KEY ("contatoCandidatosIdCandidato", "contatoCandidatosIdFuncionario") REFERENCES "contato_candidatos"("id_candidato", "id_funcionario") ON DELETE SET NULL ON UPDATE CASCADE;
