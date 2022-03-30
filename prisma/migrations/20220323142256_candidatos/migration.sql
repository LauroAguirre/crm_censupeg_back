-- DropForeignKey
ALTER TABLE "candidatos" DROP CONSTRAINT "candidatos_id_usuario_cadastro_fkey";

-- AlterTable
ALTER TABLE "candidatos" ADD COLUMN     "id_usuario_ultimo_contato" TEXT,
ALTER COLUMN "id_usuario_cadastro" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_usuario_cadastro_fkey" FOREIGN KEY ("id_usuario_cadastro") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_usuario_ultimo_contato_fkey" FOREIGN KEY ("id_usuario_ultimo_contato") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
