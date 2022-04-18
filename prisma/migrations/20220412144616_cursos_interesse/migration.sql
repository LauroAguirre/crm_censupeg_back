/*
  Warnings:

  - You are about to drop the column `contato_matutino` on the `candidatos` table. All the data in the column will be lost.
  - You are about to drop the column `contato_noturno` on the `candidatos` table. All the data in the column will be lost.
  - You are about to drop the column `contato_vespertino` on the `candidatos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidatos" DROP COLUMN "contato_matutino",
DROP COLUMN "contato_noturno",
DROP COLUMN "contato_vespertino",
ADD COLUMN     "horario_matutino" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "horario_noturno" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "horario_vespertino" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "outros_cursos_interesse" TEXT,
ALTER COLUMN "sexo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "cursos_interesse" (
    "idCurso" INTEGER NOT NULL,
    "idCandidato" TEXT NOT NULL,
    "dt_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cursos_interesse_pkey" PRIMARY KEY ("idCurso","idCandidato")
);

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_idCandidato_fkey" FOREIGN KEY ("idCandidato") REFERENCES "candidatos"("id_candidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;
