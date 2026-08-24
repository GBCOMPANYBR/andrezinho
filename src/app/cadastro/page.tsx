"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Label, INPUT_CLASS, ErrorBanner } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cadastrar, type EstadoCadastro } from "./actions";

const ESTADO_INICIAL: EstadoCadastro = {};

export default function CadastroPage() {
  const [estado, formAction] = useActionState(cadastrar, ESTADO_INICIAL);

  return (
    <Container className="max-w-lg py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Criar minha conta
      </h1>
      <p className="mt-2 text-ink-soft">
        Um único cadastro serve para comprar e para anunciar. Pedimos alguns
        dados de verificação para manter a plataforma confiável para todo
        mundo.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        {estado.erro && <ErrorBanner>{estado.erro}</ErrorBanner>}

        <div>
          <Label htmlFor="nome">Nome completo</Label>
          <input id="nome" name="nome" required className={INPUT_CLASS} placeholder="Seu nome completo" />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <input id="email" name="email" type="email" autoComplete="email" required className={INPUT_CLASS} placeholder="voce@email.com" />
        </div>

        <div>
          <Label htmlFor="senha">Senha</Label>
          <input id="senha" name="senha" type="password" autoComplete="new-password" required minLength={6} className={INPUT_CLASS} placeholder="Mínimo 6 caracteres" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <input id="cpf" name="cpf" inputMode="numeric" required className={INPUT_CLASS} placeholder="000.000.000-00" />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <input id="telefone" name="telefone" type="tel" inputMode="tel" required className={INPUT_CLASS} placeholder="(15) 99999-0000" />
          </div>
        </div>

        <div>
          <Label htmlFor="cidade">Cidade</Label>
          <input id="cidade" name="cidade" required className={INPUT_CLASS} placeholder="Sua cidade, UF" />
        </div>

        <div>
          <Label htmlFor="endereco">Endereço completo</Label>
          <input id="endereco" name="endereco" required className={INPUT_CLASS} placeholder="Rua, número, bairro" />
        </div>

        <div>
          <Label htmlFor="documento">Foto do documento (RG ou CNH)</Label>
          <input
            id="documento"
            name="documento"
            type="file"
            accept="image/*"
            required
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          />
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" strokeWidth={1.75} />
            Usado só para verificação de identidade, não fica público.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-cream-dark/60 p-4 text-xs leading-relaxed text-ink-soft">
          <p className="font-medium text-ink">Antes de continuar</p>
          <p className="mt-1">
            Ao anunciar, você (vendedor) é o único responsável pela veracidade
            da descrição e pela procedência do produto. O Andrezinho confere
            fisicamente o item antes da entrega e media eventuais disputas
            entre comprador e vendedor, mas isso não é uma garantia de
            reembolso.
          </p>
          <label className="mt-3 flex items-start gap-2">
            <input type="checkbox" name="aceiteTermos" required className="mt-0.5 h-4 w-4 rounded border-line accent-brand-600" />
            <span>Li e concordo com os Termos de Uso.</span>
          </label>
        </div>

        <SubmitButton pendingText="Criando conta..." className="w-full">
          Criar conta
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-medium text-brand-700 hover:underline">
          Entrar
        </Link>
      </p>
    </Container>
  );
}
