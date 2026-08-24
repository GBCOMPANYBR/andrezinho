"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { produtoDisponivel } from "@/lib/produtos";

export interface EstadoOferta {
  erro?: string;
}

export async function enviarOferta(
  produtoId: string,
  _estado: EstadoOferta,
  formData: FormData
): Promise<EstadoOferta> {
  const usuario = await exigirUsuario();

  const valorTexto = String(formData.get("valor") ?? "").replace(",", ".");
  const valor = Number(valorTexto);
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (!Number.isFinite(valor) || valor <= 0) {
    return { erro: "Informe um valor de oferta válido." };
  }

  const produto = await db.produto.findUnique({
    where: { id: produtoId },
    include: { pedidos: { select: { status: true } } },
  });
  if (!produto) redirect("/produtos");
  if (produto.vendedorId === usuario.id) {
    return { erro: "Você não pode fazer uma oferta no seu próprio anúncio." };
  }
  if (!produtoDisponivel(produto.pedidos)) {
    return { erro: "Este produto já foi vendido." };
  }

  const ofertaExistente = await db.oferta.findFirst({
    where: { produtoId, compradorId: usuario.id, status: "pendente" },
  });
  if (ofertaExistente) {
    redirect(`/painel`);
  }

  await db.oferta.create({
    data: {
      produtoId,
      compradorId: usuario.id,
      valor,
      mensagem: mensagem || null,
    },
  });

  revalidatePath("/painel");
  redirect(`/painel?oferta=enviada`);
}
