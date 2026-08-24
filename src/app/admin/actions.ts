"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

export async function marcarComoPago(pedidoId: string) {
  await exigirAdmin();
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.status !== "vendido") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "pago" } });
  revalidatePath("/admin");
  revalidatePath("/painel");
}

export async function enviarParaConferenciaAdmin(pedidoId: string) {
  await exigirAdmin();
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.status !== "pago") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "a_caminho_conferencia" } });
  revalidatePath("/admin");
  revalidatePath("/painel");
}

export async function concluirPedidoAdmin(pedidoId: string) {
  await exigirAdmin();
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.status !== "liberado") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "concluido" } });
  revalidatePath("/admin");
  revalidatePath("/painel");
}

export async function iniciarConferencia(pedidoId: string) {
  await exigirAdmin();
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.status !== "a_caminho_conferencia") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "em_conferencia" } });
  revalidatePath("/admin");
}

export async function aprovarConferencia(pedidoId: string) {
  await exigirAdmin();
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.status !== "em_conferencia") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "liberado" } });
  revalidatePath("/admin");
  revalidatePath("/painel");
}

export async function reprovarConferencia(pedidoId: string) {
  await exigirAdmin();
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido || pedido.status !== "em_conferencia") return;

  await db.pedido.update({ where: { id: pedidoId }, data: { status: "reprovado" } });
  revalidatePath("/admin");
  revalidatePath("/painel");
  revalidatePath("/produtos");
}
