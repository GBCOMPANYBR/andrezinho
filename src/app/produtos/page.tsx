import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { listarProdutos } from "@/lib/produtos";

export const metadata: Metadata = {
  title: "Produtos — Andrezinho",
};

export default async function ProdutosPage() {
  const produtos = await listarProdutos();

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Produtos
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Preço do vendedor e taxa de intermediação de 6% sempre visíveis — sem
        letra miúda.
      </p>

      <div className="mt-6">
        <CategoryFilter produtos={produtos} />
      </div>
    </Container>
  );
}
