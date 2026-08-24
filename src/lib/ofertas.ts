import { db } from "@/lib/db";

export async function listarOfertasPendentesDoVendedor(vendedorId: string) {
  return db.oferta.findMany({
    where: { status: "pendente", produto: { vendedorId } },
    include: { produto: true, comprador: { select: { id: true, cidade: true } } },
    orderBy: { criadoEm: "desc" },
  });
}

export async function listarOfertasDoComprador(compradorId: string) {
  return db.oferta.findMany({
    where: { compradorId },
    include: { produto: { include: { vendedor: { select: { cidade: true } } } } },
    orderBy: { criadoEm: "desc" },
  });
}

export async function ofertaPendenteDoUsuario(produtoId: string, compradorId: string) {
  return db.oferta.findFirst({
    where: { produtoId, compradorId, status: "pendente" },
  });
}
