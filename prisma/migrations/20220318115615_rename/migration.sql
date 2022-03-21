/*
  Warnings:

  - You are about to drop the column `dataExpiracao` on the `RefreshKeys` table. All the data in the column will be lost.
  - You are about to drop the column `idUsuario` on the `RefreshKeys` table. All the data in the column will be lost.
  - You are about to drop the column `ipOrigem` on the `RefreshKeys` table. All the data in the column will be lost.
  - You are about to drop the column `tokenAtual` on the `RefreshKeys` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `perfilUsuario` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `senhaTemp` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `unidadesId` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `dt_expiracao` to the `RefreshKeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `RefreshKeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_atual` to the `RefreshKeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_atualizacao` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_usuario` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshKeys" DROP CONSTRAINT "RefreshKeys_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_unidadesId_fkey";

-- AlterTable
ALTER TABLE "RefreshKeys" RENAME COLUMN "dataExpiracao" TO "dt_expiracao";
ALTER TABLE "RefreshKeys" RENAME COLUMN "idUsuario" TO "id_usuario";
ALTER TABLE "RefreshKeys" RENAME COLUMN "ipOrigem" TO "ip_origem";
ALTER TABLE "RefreshKeys" RENAME COLUMN "tokenAtual" TO "token_atual";

-- AlterTable
ALTER TABLE "Usuarios" RENAME COLUMN "createdAt" TO "dt_cadastro";
ALTER TABLE "Usuarios" RENAME COLUMN "perfilUsuario" TO "perfil_usuario";
ALTER TABLE "Usuarios" RENAME COLUMN "senhaTemp" TO "senha_temp";
ALTER TABLE "Usuarios" RENAME COLUMN "unidadesId" TO "id_unidade";
ALTER TABLE "Usuarios" RENAME COLUMN "updatedAt" TO "dt_atualizacao";

-- CreateTable
CREATE TABLE "candidatos" (
    "id_candidato" TEXT NOT NULL,
    "dt_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fone1" TEXT NOT NULL,
    "fone2" TEXT,
    "cpf" TEXT,
    "dt_nascimento" TIMESTAMP(3),
    "escolaridade" INTEGER,
    "curso_atuao" TEXT,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "aluno_censupeg" BOOLEAN NOT NULL DEFAULT false,
    "outras_infos" TEXT,
    "id_usuario_cadastro" TEXT NOT NULL,
    "dt_ultimo_contato" TIMESTAMP(3),

    CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id_candidato")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id_empresa" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "razao_social" TEXT,
    "cnpj" TEXT,
    "nome_contato" TEXT NOT NULL,
    "email_contato" TEXT,
    "fone_contato" TEXT,
    "fone_contato_2" TEXT,
    "situacao" INTEGER NOT NULL,
    "outras_infos" TEXT,
    "id_usuario_cad" TEXT NOT NULL,
    "dt_ultimo_contato" TIMESTAMP(3),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id_empresa")
);

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_usuario_cadastro_fkey" FOREIGN KEY ("id_usuario_cadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_usuario_cad_fkey" FOREIGN KEY ("id_usuario_cad") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshKeys" ADD CONSTRAINT "RefreshKeys_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "Unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
