-- CreateTable
CREATE TABLE "Agendamentos" (
    "id_agendamento" TEXT NOT NULL,
    "data_agendamento" TIMESTAMP(3) NOT NULL,
    "id_funcionario" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_atividade" INTEGER NOT NULL,
    "id_candidato" TEXT,
    "id_empresa" TEXT,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "data_conclusao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamentos_pkey" PRIMARY KEY ("id_agendamento")
);

-- CreateTable
CREATE TABLE "Campanhas" (
    "id_campanha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "id_zappier" TEXT NOT NULL,

    CONSTRAINT "Campanhas_pkey" PRIMARY KEY ("id_campanha")
);

-- CreateTable
CREATE TABLE "campanhas_redes_sociais" (
    "id_campanha" TEXT NOT NULL,
    "id_rede_social" INTEGER NOT NULL,

    CONSTRAINT "campanhas_redes_sociais_pkey" PRIMARY KEY ("id_campanha","id_rede_social")
);

-- CreateTable
CREATE TABLE "campanhas_unidades" (
    "id_campanha" TEXT NOT NULL,
    "id_unidade" INTEGER NOT NULL,

    CONSTRAINT "campanhas_unidades_pkey" PRIMARY KEY ("id_campanha","id_unidade")
);

-- CreateTable
CREATE TABLE "RedesSociais" (
    "id_rede_social" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "RedesSociais_pkey" PRIMARY KEY ("id_rede_social")
);

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id_candidato") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas_redes_sociais" ADD CONSTRAINT "campanhas_redes_sociais_id_campanha_fkey" FOREIGN KEY ("id_campanha") REFERENCES "Campanhas"("id_campanha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas_redes_sociais" ADD CONSTRAINT "campanhas_redes_sociais_id_rede_social_fkey" FOREIGN KEY ("id_rede_social") REFERENCES "RedesSociais"("id_rede_social") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas_unidades" ADD CONSTRAINT "campanhas_unidades_id_campanha_fkey" FOREIGN KEY ("id_campanha") REFERENCES "Campanhas"("id_campanha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas_unidades" ADD CONSTRAINT "campanhas_unidades_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
