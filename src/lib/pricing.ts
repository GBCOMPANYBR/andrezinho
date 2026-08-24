export const TAXA_INTERMEDIACAO = 0.06;

export function calcularTaxa(precoVendedor: number): number {
  return precoVendedor * TAXA_INTERMEDIACAO;
}

export function calcularTotalComprador(precoVendedor: number): number {
  return precoVendedor + calcularTaxa(precoVendedor);
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
