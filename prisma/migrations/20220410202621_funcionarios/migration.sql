/*
  Warnings:

  - You are about to drop the column `id_usuario_cadastro` on the `candidatos` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario_ultimo_contato` on the `candidatos` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario_cad` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario_ultimo_contato` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the `CursosEmUnidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshKeys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_funcionario_cad` to the `empresas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CursosEmUnidades" DROP CONSTRAINT "CursosEmUnidades_idCurso_fkey";

-- DropForeignKey
ALTER TABLE "CursosEmUnidades" DROP CONSTRAINT "CursosEmUnidades_idUnidade_fkey";

-- DropForeignKey
ALTER TABLE "RefreshKeys" DROP CONSTRAINT "RefreshKeys_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_id_unidade_fkey";

-- DropForeignKey
ALTER TABLE "candidatos" DROP CONSTRAINT "candidatos_id_usuario_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "candidatos" DROP CONSTRAINT "candidatos_id_usuario_ultimo_contato_fkey";

-- DropForeignKey
ALTER TABLE "empresas" DROP CONSTRAINT "empresas_id_usuario_cad_fkey";

-- DropForeignKey
ALTER TABLE "empresas" DROP CONSTRAINT "empresas_id_usuario_ultimo_contato_fkey";

-- AlterTable
ALTER TABLE "candidatos" DROP COLUMN "id_usuario_cadastro",
DROP COLUMN "id_usuario_ultimo_contato",
ADD COLUMN     "id_funcionario_cadastro" TEXT,
ADD COLUMN     "id_funcionario_ultimo_contato" TEXT;

-- AlterTable
ALTER TABLE "empresas" DROP COLUMN "id_usuario_cad",
DROP COLUMN "id_usuario_ultimo_contato",
ADD COLUMN     "id_funcionario_cad" TEXT NOT NULL,
ADD COLUMN     "id_funcionario_ultimo_contato" TEXT;

-- DropTable
DROP TABLE "CursosEmUnidades";

-- DropTable
DROP TABLE "RefreshKeys";

-- DropTable
DROP TABLE "Unidades";

-- DropTable
DROP TABLE "Usuarios";

-- CreateTable
CREATE TABLE "cursos_unidades" (
    "idCurso" INTEGER NOT NULL,
    "idUnidade" INTEGER NOT NULL,
    "dt_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cursos_unidades_pkey" PRIMARY KEY ("idCurso","idUnidade")
);

-- CreateTable
CREATE TABLE "refresh_keys" (
    "id" TEXT NOT NULL,
    "dt_expiracao" TIMESTAMP(3) NOT NULL,
    "token_atual" TEXT NOT NULL,
    "id_funcionario" TEXT NOT NULL,
    "ip_origem" TEXT,

    CONSTRAINT "refresh_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" TEXT NOT NULL,
    "dt_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(80) NOT NULL,
    "cpf" TEXT,
    "telefone" TEXT,
    "email" VARCHAR(120) NOT NULL,
    "senha" VARCHAR(80) NOT NULL,
    "senha_temp" BOOLEAN NOT NULL DEFAULT true,
    "perfil_funcionario" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_unidade" INTEGER,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_nome_key" ON "unidades"("nome");

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_funcionario_cadastro_fkey" FOREIGN KEY ("id_funcionario_cadastro") REFERENCES "funcionarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_funcionario_ultimo_contato_fkey" FOREIGN KEY ("id_funcionario_ultimo_contato") REFERENCES "funcionarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_unidades" ADD CONSTRAINT "cursos_unidades_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_unidades" ADD CONSTRAINT "cursos_unidades_idUnidade_fkey" FOREIGN KEY ("idUnidade") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_funcionario_cad_fkey" FOREIGN KEY ("id_funcionario_cad") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_funcionario_ultimo_contato_fkey" FOREIGN KEY ("id_funcionario_ultimo_contato") REFERENCES "funcionarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_keys" ADD CONSTRAINT "refresh_keys_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
