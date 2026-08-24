import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-dark">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-ink-soft">
            Marketplace local de oportunidades reais — preços bem abaixo do
            mercado, com o Andrezinho garantindo que o negócio saia do papel:
            pago e entregue com segurança.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-ink">Plataforma</p>
            <Link href="/produtos" className="text-ink-soft hover:text-ink">
              Produtos
            </Link>
            <Link href="/anunciar" className="text-ink-soft hover:text-ink">
              Anunciar
            </Link>
            <Link href="/painel" className="text-ink-soft hover:text-ink">
              Meu painel
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-ink">Conta</p>
            <Link href="/entrar" className="text-ink-soft hover:text-ink">
              Entrar
            </Link>
            <Link href="/cadastro" className="text-ink-soft hover:text-ink">
              Cadastrar
            </Link>
          </div>
        </div>
      </Container>

      <Container className="border-t border-line/70 py-4 text-xs text-ink-soft">
        © {new Date().getFullYear()} Andrezinho. Marketplace de intermediação
        local — a plataforma media eventuais disputas, mas o vendedor é o
        único responsável pela veracidade e procedência do produto anunciado.
      </Container>
    </footer>
  );
}
