import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, PackageCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { PriceBreakdown } from "@/components/product/PriceBreakdown";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { getCategoriaPorId } from "@/lib/categorias";
import {
  buscarProdutoPorId,
  contarVendasConcluidas,
  parseFotos,
  produtoDisponivel,
} from "@/lib/produtos";
import { getUsuarioAtual } from "@/lib/auth";
import { LinkButton } from "@/components/ui/Button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { comprar } from "./actions";

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [produto, usuarioAtual] = await Promise.all([
    buscarProdutoPorId(id),
    getUsuarioAtual(),
  ]);
  if (!produto) notFound();

  const categoria = getCategoriaPorId(produto.categoria);
  const fotos = parseFotos(produto.fotos);
  const disponivel = produtoDisponivel(produto.pedidos);
  const vendasConcluidas = await contarVendasConcluidas(produto.vendedorId);
  const ehVendedor = usuarioAtual?.id === produto.vendedorId;
  const gradiente = "from-brand-200 via-brand-100 to-cream-dark";

  const comprarComId = comprar.bind(null, produto.id);

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div
            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${gradiente}`}
          >
            {fotos[0] ? (
              <Image src={fotos[0]} alt={produto.titulo} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              categoria && (
                <CategoryIcon name={categoria.icone} className="h-24 w-24 text-brand-600 opacity-70" />
              )
            )}
          </div>
          {fotos.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {fotos.slice(1, 5).map((foto, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={foto} alt={`${produto.titulo} foto ${i + 2}`} fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {categoria?.nome}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {produto.titulo}
          </h1>

          <div className="mt-3 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
            {produto.vendedor.cidade}
          </div>

          <div className="mt-4">
            <TrustBadge />
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-medium text-ink">Descrição</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
              {produto.descricao}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="text-sm font-medium text-ink">{produto.vendedor.nome}</p>
              {vendasConcluidas > 0 ? (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                  <PackageCheck className="h-4 w-4 text-brand-600" strokeWidth={1.75} />
                  {vendasConcluidas} {vendasConcluidas === 1 ? "venda concluída" : "vendas concluídas"} no Andrezinho
                </div>
              ) : (
                <p className="mt-1 text-sm text-ink-soft">
                  Novo no Andrezinho — ainda sem vendas concluídas
                </p>
              )}
            </div>
            <ShieldCheck className="h-8 w-8 text-brand-600" strokeWidth={1.5} />
          </div>

          <div className="mt-6">
            <PriceBreakdown preco={produto.preco} />
          </div>

          {ehVendedor ? (
            <p className="mt-6 rounded-xl bg-cream-dark px-4 py-3 text-center text-sm text-ink-soft">
              Este é o seu anúncio.
            </p>
          ) : !disponivel ? (
            <p className="mt-6 rounded-xl bg-cream-dark px-4 py-3 text-center text-sm text-ink-soft">
              Este produto já foi vendido.
            </p>
          ) : usuarioAtual ? (
            <form action={comprarComId}>
              <SubmitButton pendingText="Processando..." variant="cta" className="mt-6 w-full">
                Comprar agora
              </SubmitButton>
            </form>
          ) : (
            <LinkButton href="/entrar" variant="cta" size="lg" className="mt-6 w-full">
              Entrar para comprar
            </LinkButton>
          )}
          <p className="mt-3 text-center text-xs text-ink-soft">
            O pagamento fica retido até a conferência física do produto pelo
            Andrezinho.
          </p>
        </div>
      </div>
    </Container>
  );
}
