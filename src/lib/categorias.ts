export type CategoriaId =
  | "eletronicos"
  | "informatica"
  | "eletrodomesticos"
  | "moveis"
  | "esportes"
  | "moda"
  | "games"
  | "outros";

export interface Categoria {
  id: CategoriaId;
  nome: string;
  icone: string;
}

export const categorias: Categoria[] = [
  { id: "eletronicos", nome: "Eletrônicos", icone: "smartphone" },
  { id: "informatica", nome: "Informática", icone: "laptop" },
  { id: "eletrodomesticos", nome: "Eletrodomésticos", icone: "refrigerator" },
  { id: "moveis", nome: "Móveis", icone: "sofa" },
  { id: "esportes", nome: "Esportes", icone: "bike" },
  { id: "moda", nome: "Moda", icone: "shirt" },
  { id: "games", nome: "Games", icone: "gamepad-2" },
  { id: "outros", nome: "Outros", icone: "shopping-bag" },
];

export function getCategoriaPorId(id: string): Categoria | undefined {
  return categorias.find((c) => c.id === id);
}
