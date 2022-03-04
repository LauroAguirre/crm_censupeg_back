-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "unidadesId" INTEGER;

-- CreateTable
CREATE TABLE "Unidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "Unidades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unidades_nome_key" ON "Unidades"("nome");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_unidadesId_fkey" FOREIGN KEY ("unidadesId") REFERENCES "Unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
