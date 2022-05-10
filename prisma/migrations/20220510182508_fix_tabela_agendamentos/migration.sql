/*
  Warnings:

  - You are about to drop the `Agendamentos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_id_candidato_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_id_empresa_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_id_funcionario_fkey";

-- DropTable
DROP TABLE "Agendamentos";

-- CreateTable
CREATE TABLE "agendamentos" (
    "id_agendamento" TEXT NOT NULL,
    "data_agendamento" TIMESTAMP(3) NOT NULL,
    "id_funcionario" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_atividade" INTEGER NOT NULL,
    "id_candidato" TEXT,
    "id_empresa" TEXT,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "data_conclusao" TIMESTAMP(3),

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id_agendamento")
);

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id_candidato") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
