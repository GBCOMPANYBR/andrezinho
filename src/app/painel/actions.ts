"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";

export async function simularPagamento(pedidoId: string) {
  const usuario = await exigirUsuario();

  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.compradorId !== usuario.id) return;
  if (pedido.status !== "aguardando_pagamento") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "pago" } });
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
