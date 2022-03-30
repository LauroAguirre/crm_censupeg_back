-- CreateTable
CREATE TABLE "cursos" (
    "id_curso" SERIAL NOT NULL,
    "dt_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT NOT NULL,
    "modalidade" INTEGER NOT NULL,
    "tipo" INTEGER NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "duracao" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "ifnos_adicionais" TEXT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id_curso")
);
