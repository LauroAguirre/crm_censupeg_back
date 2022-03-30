-- CreateTable
CREATE TABLE "CursosEmUnidades" (
    "idCurso" INTEGER NOT NULL,
    "idUnidade" INTEGER NOT NULL,
    "dt_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CursosEmUnidades_pkey" PRIMARY KEY ("idCurso","idUnidade")
);

-- AddForeignKey
ALTER TABLE "CursosEmUnidades" ADD CONSTRAINT "CursosEmUnidades_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursosEmUnidades" ADD CONSTRAINT "CursosEmUnidades_idUnidade_fkey" FOREIGN KEY ("idUnidade") REFERENCES "Unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
