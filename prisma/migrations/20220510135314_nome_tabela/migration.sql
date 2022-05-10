/*
  Warnings:

  - You are about to drop the `Campanhas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campanhas_redes_sociais" DROP CONSTRAINT "campanhas_redes_sociais_id_campanha_fkey";

-- DropForeignKey
ALTER TABLE "campanhas_unidades" DROP CONSTRAINT "campanhas_unidades_id_campanha_fkey";

-- DropForeignKey
ALTER TABLE "candidatos" DROP CONSTRAINT "candidatos_id_campanha_fkey";

-- DropTable
DROP TABLE "Campanhas";

-- CreateTable
CREATE TABLE "campanhas" (
    "id_campanha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "id_zappier" TEXT NOT NULL,

    CONSTRAINT "campanhas_pkey" PRIMARY KEY ("id_campanha")
);

-- AddForeignKey
ALTER TABLE "campanhas_redes_sociais" ADD CONSTRAINT "campanhas_redes_sociais_id_campanha_fkey" FOREIGN KEY ("id_campanha") REFERENCES "campanhas"("id_campanha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas_unidades" ADD CONSTRAINT "campanhas_unidades_id_campanha_fkey" FOREIGN KEY ("id_campanha") REFERENCES "campanhas"("id_campanha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_campanha_fkey" FOREIGN KEY ("id_campanha") REFERENCES "campanhas"("id_campanha") ON DELETE SET NULL ON UPDATE CASCADE;
