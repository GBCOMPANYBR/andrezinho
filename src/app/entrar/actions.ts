"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao, verificarSenha } from "@/lib/auth";

export interface EstadoEntrar {
  erro?: string;
}

export async function entrar(
  _estado: EstadoEntrar,
  formData: FormData
): Promise<EstadoEntrar> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const usuario = await db.user.findUnique({ where: { email } });
  if (!usuario || !(await verificarSenha(senha, usuario.senhaHash))) {
    return { erro: "E-mail ou senha incorretos." };
  }

  await criarSessao(usuario.id);
  redirect(usuario.isAdmin ? "/admin" : "/painel");
}
