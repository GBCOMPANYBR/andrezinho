"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { calcularTaxa, calcularTotalComprador } from "@/lib/pricing";
import { produtoDisponivel } from "@/lib/produtos";

export async function comprar(produtoId: string) {
  const usuario = await exigirUsuario();

  const produto = await db.produto.findUnique({
    where: { id: produtoId },
    include: { pedidos: { select: { status: true } } },
  });

  if (!produto) {
    redirect("/produtos");
  }
  if (produto.vendedorId === usuario.id) {
    return;
  }
  if (!produtoDisponivel(produto.pedidos)) {
    return;
  }

  const pedido = await db.pedido.create({
    data: {
      produtoId: produto.id,
      compradorId: usuario.id,
      precoProduto: produto.preco,
      taxa: calcularTaxa(produto.preco),
      total: calcularTotalComprador(produto.preco),
      status: "aguardando_pagamento",
    },
  });

  revalidatePath("/produtos");
  revalidatePath(`/produto/${produto.id}`);
  revalidatePath("/painel");
  redirect(`/painel?pedido=${pedido.id}`);
}
