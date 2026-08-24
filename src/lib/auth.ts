import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const COOKIE_NAME = "andrezinho_session";
const SESSAO_DIAS = 30;

export async function hashSenha(senha: string) {
  return bcrypt.hash(senha, 10);
}

export async function verificarSenha(senha: string, hash: string) {
  return bcrypt.compare(senha, hash);
}

export async function criarSessao(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + SESSAO_DIAS * 24 * 60 * 60 * 1000);

  await db.session.create({ data: { id: token, userId, expiraEm } });

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiraEm,
    path: "/",
  });
}

export async function encerrarSessao() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.session.delete({ where: { id: token } }).catch(() => {});
  }
  jar.delete(COOKIE_NAME);
}

export async function getUsuarioAtual() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const sessao = await db.session.findUnique({
    where: { id: token },
    include: { user: true },
  });

  if (!sessao || sessao.expiraEm < new Date()) return null;
  return sessao.user;
}

export async function exigirUsuario(redirecionarPara = "/entrar") {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect(redirecionarPara);
  return usuario;
}

export async function exigirAdmin() {
  const usuario = await exigirUsuario();
  if (!usuario.isAdmin) redirect("/painel");
  return usuario;
}
