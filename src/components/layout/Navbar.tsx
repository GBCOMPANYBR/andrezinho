"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Plus, LogOut } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { sair } from "@/app/actions";

interface NavbarProps {
  usuario: { nome: string; isAdmin: boolean } | null;
}

export function Navbar({ usuario }: NavbarProps) {
  const [aberto, setAberto] = useState(false);

  const links = [
    { href: "/produtos", label: "Produtos" },
    usuario?.isAdmin
      ? { href: "/admin", label: "Conferência" }
      : { href: "/painel", label: "Meu painel" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {usuario ? (
            <>
              {usuario.isAdmin && (
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-100">
                  <Image
                    src="/images/andrezinho-avatar.jpg"
                    alt="Andrezinho"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              )}
              <form action={sair}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/entrar"
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              Entrar
            </Link>
          )}
          <LinkButton href="/anunciar" size="md" variant="primary">
            <Plus className="h-4 w-4" />
            Anunciar
          </LinkButton>
        </div>

        <button
          onClick={() => setAberto((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink sm:hidden"
          aria-label="Abrir menu"
        >
          {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {aberto && (
        <div className="border-t border-line bg-cream sm:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream-dark hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            {usuario ? (
              <>
                {usuario.isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink">
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-100">
                      <Image
                        src="/images/andrezinho-avatar.jpg"
                        alt="Andrezinho"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    {usuario.nome}
                  </div>
                )}
                <form action={sair}>
                  <button
                    type="submit"
                    onClick={() => setAberto(false)}
                    className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-soft hover:bg-cream-dark hover:text-ink"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/entrar"
                onClick={() => setAberto(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream-dark hover:text-ink"
              >
                Entrar
              </Link>
            )}
            <Link
              href="/anunciar"
              onClick={() => setAberto(false)}
              className="mt-1 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Anunciar produto
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
