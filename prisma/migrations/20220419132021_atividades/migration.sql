-- CreateTable
CREATE TABLE "atividades" (
    "id_funcionario" TEXT NOT NULL,
    "dt_atividade" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id_funcionario")
);

-- CreateTable
CREATE TABLE "contato_candidatos" (
    "id_candidato" TEXT NOT NULL,
    "id_funcionario" TEXT NOT NULL,
    "dt_contato" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "areas_interesse" TEXT,
    "proximo_contato" TIMESTAMP(3),
    "infos_contato" TEXT NOT NULL,
    "status_atendimento" INTEGER NOT NULL,

    CONSTRAINT "contato_candidatos_pkey" PRIMARY KEY ("id_candidato","id_funcionario")
);

-- CreateTable
CREATE TABLE "contato_empresas" (
    "id_empresa" TEXT NOT NULL,
    "id_funcionario" TEXT NOT NULL,
    "dt_contato" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "areas_interesse" TEXT,
    "proximo_contato" TIMESTAMP(3),
    "infos_contato" TEXT NOT NULL,
    "status_atendimento" INTEGER NOT NULL,

    CONSTRAINT "contato_empresas_pkey" PRIMARY KEY ("id_empresa","id_funcionario")
);

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contato_candidatos" ADD CONSTRAINT "contato_candidatos_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id_candidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contato_candidatos" ADD CONSTRAINT "contato_candidatos_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contato_empresas" ADD CONSTRAINT "contato_empresas_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contato_empresas" ADD CONSTRAINT "contato_empresas_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
