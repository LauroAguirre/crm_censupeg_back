/*
  Warnings:

  - You are about to drop the column `duracao` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `cursos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidatos" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cursos" DROP COLUMN "duracao",
DROP COLUMN "valor";

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "cpf_contato" TEXT;
