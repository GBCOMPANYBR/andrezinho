"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao, hashSenha } from "@/lib/auth";

export interface EstadoCadastro {
  erro?: string;
}

function somenteDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export async function cadastrar(
  _estado: EstadoCadastro,
  formData: FormData
): Promise<EstadoCadastro> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const cpf = somenteDigitos(String(formData.get("cpf") ?? ""));
  const telefone = somenteDigitos(String(formData.get("telefone") ?? ""));
  const cidade = String(formData.get("cidade") ?? "").trim();
  const endereco = String(formData.get("endereco") ?? "").trim();
  const fotoDocumento = String(formData.get("fotoDocumentoUrl") ?? "");
  const aceiteTermos = formData.get("aceiteTermos");

  if (!nome || nome.length < 3) {
    return { erro: "Informe seu nome completo." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { erro: "Informe um e-mail válido." };
  }
  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (cpf.length !== 11) {
    return { erro: "Informe um CPF válido (11 dígitos)." };
  }
  if (telefone.length < 10) {
    return { erro: "Informe um telefone válido com DDD." };
  }
  if (!cidade) {
    return { erro: "Informe sua cidade." };
  }
  if (!endereco || endereco.length < 5) {
    return { erro: "Informe seu endereço completo." };
  }
  if (!fotoDocumento) {
    return { erro: "Envie uma foto do seu documento." };
  }
  if (!aceiteTermos) {
    return { erro: "É preciso aceitar os Termos de Uso para continuar." };
  }

  const jaExiste = await db.user.findUnique({ where: { email } });
  if (jaExiste) {
    return { erro: "Já existe uma conta com esse e-mail." };
  }

  const senhaHash = await hashSenha(senha);

  const usuario = await db.user.create({
    data: { nome, email, senhaHash, cpf, telefone, cidade, endereco, fotoDocumento },
  });

  await criarSessao(usuario.id);
  redirect("/painel");
}
