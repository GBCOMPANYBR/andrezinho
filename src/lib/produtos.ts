import { db } from "@/lib/db";

const VENDEDOR_PUBLICO = { id: true, nome: true, cidade: true } as const;

export function parseFotos(fotos: string): string[] {
  try {
    const lista = JSON.parse(fotos);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function produtoDisponivel(pedidos: { status: string }[]) {
  return !pedidos.some((p) => p.status !== "reprovado");
}

export async function listarProdutos(categoria?: string) {
  return db.produto.findMany({
    where: categoria ? { categoria } : undefined,
    include: {
      vendedor: { select: VENDEDOR_PUBLICO },
      pedidos: { select: { status: true } },
    },
    orderBy: { criadoEm: "desc" },
  });
}

export type ProdutoComVendedor = Awaited<ReturnType<typeof listarProdutos>>[number];

export async function listarProdutosDoVendedor(vendedorId: string) {
  return db.produto.findMany({
    where: { vendedorId },
    include: { pedidos: { select: { id: true, status: true } } },
    orderBy: { criadoEm: "desc" },
  });
}

export async function buscarProdutoPorId(id: string) {
  return db.produto.findUnique({
    where: { id },
    include: {
      vendedor: { select: VENDEDOR_PUBLICO },
      pedidos: { select: { status: true } },
    },
  });
}

export async function contarVendasConcluidas(vendedorId: string) {
  return db.pedido.count({
    where: { status: "concluido", produto: { vendedorId } },
  });
}
