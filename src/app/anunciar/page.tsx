import { Container } from "@/components/layout/Container";
import { exigirUsuario } from "@/lib/auth";
import { AnuncioForm } from "./AnuncioForm";

export default async function AnunciarPage() {
  await exigirUsuario();

  return (
    <Container className="max-w-lg py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Anunciar produto
      </h1>
      <p className="mt-2 text-ink-soft">
        Você é o único responsável pela veracidade da descrição e pela
        procedência do produto. O Andrezinho confere o item fisicamente antes
        de liberar para o comprador.
      </p>

      <AnuncioForm />
    </Container>
  );
}
