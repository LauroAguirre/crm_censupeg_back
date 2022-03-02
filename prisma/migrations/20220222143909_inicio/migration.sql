-- CreateTable
CREATE TABLE "Usuarios" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(80) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "senha" VARCHAR(80) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshKeys" (
    "id" TEXT NOT NULL,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,
    "tokenAtual" TEXT NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "ipOrigem" TEXT NOT NULL,

    CONSTRAINT "RefreshKeys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RefreshKeys" ADD CONSTRAINT "RefreshKeys_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
