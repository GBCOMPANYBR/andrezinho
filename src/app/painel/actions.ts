"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { calcularTaxa, calcularTotalComprador } from "@/lib/pricing";

export async function aceitarOferta(ofertaId: string) {
  const usuario = await exigirUsuario();

  const oferta = await db.oferta.findUnique({
    where: { id: ofertaId },
    include: { produto: { include: { pedidos: { select: { status: true } } } } },
  });
  if (!oferta || oferta.produto.vendedorId !== usuario.id) return;
  if (oferta.status !== "pendente") return;
  if (oferta.produto.pedidos.some((p) => p.status !== "reprovado")) return;

  await db.$transaction([
    db.oferta.update({ where: { id: ofertaId }, data: { status: "aceita" } }),
    db.oferta.updateMany({
      where: { produtoId: oferta.produtoId, status: "pendente", id: { not: ofertaId } },
      data: { status: "recusada" },
    }),
    db.pedido.create({
      data: {
        produtoId: oferta.produtoId,
        compradorId: oferta.compradorId,
        precoProduto: oferta.valor,
        taxa: calcularTaxa(oferta.valor),
        total: calcularTotalComprador(oferta.valor),
        status: "vendido",
      },
    }),
  ]);

  revalidatePath("/painel");
  revalidatePath("/admin");
  revalidatePath("/produtos");
}

export async function recusarOferta(ofertaId: string) {
  const usuario = await exigirUsuario();

  const oferta = await db.oferta.findUnique({
    where: { id: ofertaId },
    include: { produto: true },
  });
  if (!oferta || oferta.produto.vendedorId !== usuario.id) return;
  if (oferta.status !== "pendente") return;

  await db.oferta.update({ where: { id: ofertaId }, data: { status: "recusada" } });
  revalidatePath("/painel");
}

export async function enviarParaConferencia(pedidoId: string) {
  const usuario = await exigirUsuario();

  const pedido = await db.pedido.findUnique({
    where: { id: pedidoId },
    include: { produto: true },
  });
  if (!pedido || pedido.produto.vendedorId !== usuario.id) return;
  if (pedido.status !== "pago") return;

  await db.pedido.update({
    where: { id: pedidoId },
    data: { status: "a_caminho_conferencia" },
  });
  revalidatePath("/painel");
  revalidatePath("/admin");
}

export async function concluirPedido(pedidoId: string) {
  const usuario = await exigirUsuario();

  const pedido = await db.pedido.findUnique({
    where: { id: pedidoId },
    include: { produto: true },
  });
  if (!pedido) return;
  const ehParte = pedido.compradorId === usuario.id || pedido.produto.vendedorId === usuario.id;
  if (!ehParte) return;
  if (pedido.status !== "liberado") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "concluido" } });
  revalidatePath("/painel");
}
