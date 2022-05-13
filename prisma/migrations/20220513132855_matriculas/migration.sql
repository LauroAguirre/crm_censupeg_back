-- CreateTable
CREATE TABLE "matriculas" (
    "id_matricula" SERIAL NOT NULL,
    "id_candidato" TEXT NOT NULL,
    "data_matricula" TIMESTAMP(3) NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "id_funcionario_responsavel" TEXT NOT NULL,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id_matricula")
);

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id_candidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_funcionario_responsavel_fkey" FOREIGN KEY ("id_funcionario_responsavel") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
