/*
  Warnings:

  - You are about to drop the column `curso_atuao` on the `candidatos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidatos" RENAME COLUMN "curso_atuao" TO "curso_atual";
