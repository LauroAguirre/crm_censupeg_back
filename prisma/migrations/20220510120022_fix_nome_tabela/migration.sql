/*
  Warnings:

  - You are about to drop the `RedesSociais` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campanhas_redes_sociais" DROP CONSTRAINT "campanhas_redes_sociais_id_rede_social_fkey";

-- DropTable
DROP TABLE "RedesSociais";

-- CreateTable
CREATE TABLE "redes_sociais" (
    "id_rede_social" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "redes_sociais_pkey" PRIMARY KEY ("id_rede_social")
);

-- AddForeignKey
ALTER TABLE "campanhas_redes_sociais" ADD CONSTRAINT "campanhas_redes_sociais_id_rede_social_fkey" FOREIGN KEY ("id_rede_social") REFERENCES "redes_sociais"("id_rede_social") ON DELETE RESTRICT ON UPDATE CASCADE;
