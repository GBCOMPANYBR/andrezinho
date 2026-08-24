"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Label, INPUT_CLASS, ErrorBanner } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { entrar, type EstadoEntrar } from "./actions";

const ESTADO_INICIAL: EstadoEntrar = {};

export default function EntrarPage() {
  const [estado, formAction] = useActionState(entrar, ESTADO_INICIAL);

  return (
    <Container className="max-w-sm py-16">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Entrar
      </h1>
      <p className="mt-2 text-ink-soft">
        Acesse sua conta para comprar, anunciar e acompanhar seus pedidos.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        {estado.erro && <ErrorBanner>{estado.erro}</ErrorBanner>}

        <div>
          <Label htmlFor="email">E-mail</Label>
          <input id="email" name="email" type="email" autoComplete="email" required className={INPUT_CLASS} placeholder="voce@email.com" />
        </div>

        <div>
          <Label htmlFor="senha">Senha</Label>
          <input id="senha" name="senha" type="password" autoComplete="current-password" required className={INPUT_CLASS} placeholder="Sua senha" />
        </div>

        <SubmitButton pendingText="Entrando..." className="w-full">
          Entrar
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-brand-700 hover:underline">
          Criar conta
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-line p-4 text-xs text-ink-soft">
        <p className="font-medium text-ink">Login de teste</p>
        <p className="mt-1">admin: andrezinho@andrezinho.com</p>
        <p>vendedor: marcos@exemplo.com</p>
        <p>senha para os dois: andrezinho123</p>
      </div>
    </Container>
  );
}
