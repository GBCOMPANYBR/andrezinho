import Image from "next/image";
import { ArrowRight, ShieldCheck, Tag, Sparkles, Truck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { formatarPreco } from "@/lib/pricing";
import { listarProdutos } from "@/lib/produtos";

const PASSOS = [
  {
    icone: Sparkles,
    titulo: "Encontre a oportunidade",
    texto:
      "Navegue pelos anúncios da sua região — produtos com preços bem abaixo do mercado, de vendedores verificados.",
  },
  {
    icone: Tag,
    titulo: "Feche o negócio com preço transparente",
    texto:
      "Você sempre vê o preço do vendedor e o total com a taxa de 6% já somada — sem surpresa no final.",
  },
  {
    icone: ShieldCheck,
    titulo: "Andrezinho confere o produto",
    texto:
      "O vendedor envia o item para conferência física antes de liberar. É assim que a oportunidade vira negócio garantido.",
  },
  {
    icone: Truck,
    titulo: "Retire ou receba em casa",
    texto:
      "Depois de conferido e liberado, você escolhe: retira no local ou paga o frete para receber onde estiver.",
  },
];

export default async function Home() {
  const produtos = await listarProdutos();
  const destaques = produtos.slice(0, 4);

  return (
    <>
      <section className="border-b border-line bg-linear-to-b from-brand-50 to-cream">
        <Container className="flex flex-col gap-8 py-14 sm:py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-24">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Preço de oportunidade, bem abaixo do mercado
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Preço de oportunidade. Negócio de verdade.
            </h1>
            <p className="mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
              Eu encontro produtos com preços bem abaixo do mercado — o tipo
              de oportunidade que normalmente some antes de virar negócio. O
              Andrezinho é a ponte que transforma isso em uma compra paga e
              entregue de verdade, com segurança do início ao fim.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/produtos" size="lg" variant="cta">
                Ver produtos
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/anunciar" size="lg" variant="outline">
                Anunciar meu produto
              </LinkButton>
            </div>
          </div>

          <div className="flex-1 lg:max-w-md">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Exemplo real
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-ink">
                Notebook de R$ 5.000 encontrado por R$ 3.500
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Preço médio de varejo</span>
                  <span className="text-ink-soft line-through">
                    {formatarPreco(5000)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Preço do vendedor no Andrezinho</span>
                  <span className="font-medium text-ink">{formatarPreco(3500)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <span className="text-ink-soft">Taxa de intermediação (6%)</span>
                  <span className="text-ink-soft">+ {formatarPreco(3500 * 0.06)}</span>
                </div>
                <div className="flex items-center justify-between font-display text-base font-semibold">
                  <span>Você paga</span>
                  <span className="text-accent-600">
                    {formatarPreco(3500 * 1.06)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Como funciona
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Da oportunidade até a sua casa — cada etapa existe para
            transformar um preço bom em negócio pago e entregue de verdade.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((passo, i) => (
              <div
                key={passo.titulo}
                className="relative rounded-2xl border border-line bg-white p-5"
              >
                <span className="font-display text-sm font-semibold text-accent-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <passo.icone className="mt-3 h-7 w-7 text-brand-600" strokeWidth={1.75} />
                <h3 className="mt-3 font-display text-base font-semibold text-ink">
                  {passo.titulo}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{passo.texto}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-dark py-14 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Produtos em destaque
              </h2>
              <p className="mt-2 text-ink-soft">
                Anúncios recentes de vendedores verificados na sua região.
              </p>
            </div>
            <LinkButton href="/produtos" variant="ghost" size="md">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {destaques.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-brand-100">
            <Image
              src="/images/andrezinho-avatar.jpg"
              alt="Andrezinho, fundador do Andrezinho"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <p className="max-w-2xl font-display text-xl italic text-ink sm:text-2xl">
            &ldquo;Eu corro atrás das melhores oportunidades de preço que
            existem por aí. O Andrezinho garante que cada uma vire negócio de
            verdade — pago e entregue, com o meu nome nisso.&rdquo;
          </p>
          <p className="text-sm text-ink-soft">Andrezinho, fundador</p>
        </Container>
      </section>

      <section className="bg-brand-700 py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Pronto para comprar ou vender por aqui?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/cadastro" size="lg" variant="cta">
              Criar minha conta
            </LinkButton>
            <LinkButton
              href="/produtos"
              size="lg"
              variant="outline"
              className="border-white/30! bg-transparent! text-white! hover:border-white!"
            >
              Explorar produtos
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
