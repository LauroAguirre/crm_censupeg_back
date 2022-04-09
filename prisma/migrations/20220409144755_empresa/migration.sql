/*
  Warnings:

  - Added the required column `sexo` to the `candidatos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidatos" ADD COLUMN     "contato_matutino" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contato_noturno" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contato_vespertino" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "formacao" TEXT,
ADD COLUMN     "interesse_ead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interesse_graduacao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interesse_pos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interesse_presencial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sexo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "logradouro" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "outra_situacao" TEXT,
ADD COLUMN     "uf" TEXT;
