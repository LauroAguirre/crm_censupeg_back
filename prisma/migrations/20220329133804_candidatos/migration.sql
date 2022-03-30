-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "id_usuario_ultimo_contato" TEXT;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_usuario_ultimo_contato_fkey" FOREIGN KEY ("id_usuario_ultimo_contato") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
