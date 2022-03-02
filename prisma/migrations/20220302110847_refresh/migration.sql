/*
  Warnings:

  - Added the required column `perfilUsuario` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshKeys" ALTER COLUMN "ipOrigem" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "perfilUsuario" INTEGER NOT NULL,
ADD COLUMN     "telefone" TEXT;
