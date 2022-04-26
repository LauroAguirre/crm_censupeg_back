/*
  Warnings:

  - The primary key for the `atividades` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "atividades" DROP CONSTRAINT "atividades_pkey",
ADD COLUMN     "idAtividade" SERIAL NOT NULL,
ADD CONSTRAINT "atividades_pkey" PRIMARY KEY ("idAtividade");
