/*
  Warnings:

  - The primary key for the `contato_candidatos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contato_empresas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contatoCandidatosIdCandidato` on the `cursos_interesse` table. All the data in the column will be lost.
  - You are about to drop the column `contatoCandidatosIdFuncionario` on the `cursos_interesse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cursos_interesse" DROP CONSTRAINT "cursos_interesse_contatoCandidatosIdCandidato_contatoCandi_fkey";

-- AlterTable
ALTER TABLE "contato_candidatos" DROP CONSTRAINT "contato_candidatos_pkey",
ADD COLUMN     "idContato" SERIAL NOT NULL,
ADD CONSTRAINT "contato_candidatos_pkey" PRIMARY KEY ("idContato");

-- AlterTable
ALTER TABLE "contato_empresas" DROP CONSTRAINT "contato_empresas_pkey",
ADD COLUMN     "idContato" SERIAL NOT NULL,
ADD CONSTRAINT "contato_empresas_pkey" PRIMARY KEY ("idContato");

-- AlterTable
ALTER TABLE "cursos_interesse" DROP COLUMN "contatoCandidatosIdCandidato",
DROP COLUMN "contatoCandidatosIdFuncionario",
ADD COLUMN     "idContatoCandidato" INTEGER;

-- AddForeignKey
ALTER TABLE "cursos_interesse" ADD CONSTRAINT "cursos_interesse_idContatoCandidato_fkey" FOREIGN KEY ("idContatoCandidato") REFERENCES "contato_candidatos"("idContato") ON DELETE SET NULL ON UPDATE CASCADE;
