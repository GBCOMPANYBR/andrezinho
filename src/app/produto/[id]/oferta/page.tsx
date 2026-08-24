import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { buscarProdutoPorId, produtoDisponivel } from "@/lib/produtos";
import { exigirUsuario } from "@/lib/auth";
import { formatarPreco } from "@/lib/pricing";
import { OfertaForm } from "./OfertaForm";

export default async function OfertaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await exigirUsuario();
  const produto = await buscarProdutoPorId(id);
  if (!produto) notFound();
  if (produto.vendedorId === usuario.id) redirect(`/produto/${id}`);
  if (!produtoDisponivel(produto.pedidos)) redirect(`/produto/${id}`);

  return (
    <Container className="max-w-lg py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Fazer uma oferta
      </h1>
      <p className="mt-2 text-ink-soft">{produto.titulo}</p>
      <p className="mt-1 text-sm text-ink-soft">
        Preço anunciado: <span className="font-medium text-ink">{formatarPreco(produto.preco)}</span>
      </p>

      <OfertaForm produtoId={produto.id} precoSugerido={produto.preco} />
    </Container>
  );
}
