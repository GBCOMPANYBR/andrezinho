-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "status" SET DEFAULT 'vendido';

-- CreateTable
CREATE TABLE "Oferta" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "mensagem" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
