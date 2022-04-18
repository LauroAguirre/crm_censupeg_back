/*
  Warnings:

  - The primary key for the `cursos_interesse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCandidato` on the `cursos_interesse` table. All the data in the column will be lost.
  - You are about to drop the column `idCurso` on the `cursos_interesse` table. All the data in the column will be lost.
  - The primary key for the `cursos_unidades` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCurso` on the `cursos_unidades` table. All the data in the column will be lost.
  - You are about to drop the column `idUnidade` on the `cursos_unidades` table. All the data in the column will be lost.
  - Added the required column `id_candidato` to the `cursos_interesse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_curso` to the `cursos_interesse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_curso` to the `cursos_unidades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_unidade` to the `cursos_unidades` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cursos_interesse" DROP CONSTRAINT "cursos_interesse_idCandidato_fkey";

-- DropForeignKey
ALTER TABLE "cursos_interesse" DROP CONSTRAINT "cursos_interesse_idCurso_fkey";

-- DropForeignKey
ALTER TABLE "cursos_unidades" DROP CONSTRAINT "cursos_unidades_idCurso_fkey";

-- DropForeignKey
ALTER TABLE "cursos_unidades" DROP CONSTRAINT "cursos_unidades_idUnidade_fkey";

-- AlterTable
ALTER TABLE "cursos_interesse" DROP CONSTRAINT "cursos_interesse_pkey",
DROP COLUMN "idCandidato",
DROP COLUMN "idCurso",
ADD COLUMN     "id_candidato" TEXT NOT NULL,
ADD COLUMN     "id_curso" INTEGER NOT NULL,
ADD CONSTRAINT "cursos_interesse_pkey" PRIMARY KEY ("id_curso", "id_candidato");

-- AlterTable
ALTER TABLE "cursos_unidades" DROP CONSTRAINT "cursos_unidades_pkey",
DROP COLUMN "idCurso",
DROP COLUMN "idUnidade",
ADD COLUMN     "id_curso" INTEGER NOT NULL,
ADD COLUMN     "id_unidade" INTEGER NOT NULL,
ADD CONSTRAINT "cursos_unidades_pkey" PRIMARY KEY ("id_curso", "id_unidade");

-- AddForeignKey
ALTER TABLE "cursos_unidades" ADD CONSTRAINT "cursos_unidades_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_unidades" ADD CONSTRAINT "cursos_unidades_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id_candidato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;
