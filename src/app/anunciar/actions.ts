"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { categorias } from "@/lib/categorias";

export interface EstadoAnunciar {
  erro?: string;
}

export async function anunciar(
  _estado: EstadoAnunciar,
  formData: FormData
): Promise<EstadoAnunciar> {
  const usuario = await exigirUsuario();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "");
  const precoTexto = String(formData.get("preco") ?? "").replace(",", ".");
  const preco = Number(precoTexto);
  const fotosUrls = formData.getAll("fotosUrls").map(String).filter(Boolean);

  if (!titulo || titulo.length < 5) {
    return { erro: "Dê um título com pelo menos 5 caracteres." };
  }
  if (!descricao || descricao.length < 20) {
    return { erro: "Descreva o produto com pelo menos 20 caracteres." };
  }
  if (!categorias.some((c) => c.id === categoria)) {
    return { erro: "Selecione uma categoria." };
  }
  if (!Number.isFinite(preco) || preco <= 0) {
    return { erro: "Informe um preço válido." };
  }
  if (fotosUrls.length === 0) {
    return { erro: "Envie pelo menos uma foto do produto." };
  }

  const produto = await db.produto.create({
    data: {
      titulo,
      descricao,
      categoria,
      preco,
      fotos: JSON.stringify(fotosUrls),
      vendedorId: usuario.id,
    },
  });

  revalidatePath("/produtos");
  revalidatePath("/painel");
  redirect(`/produto/${produto.id}`);
}
