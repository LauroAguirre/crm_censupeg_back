-- DropForeignKey
ALTER TABLE "cursos_interesse" DROP CONSTRAINT "cursos_interesse_idCandidato_fkey";

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_idCandidato_fkey" FOREIGN KEY ("idCandidato") REFERENCES "candidatos"("id_candidato") ON DELETE CASCADE ON UPDATE CASCADE;
