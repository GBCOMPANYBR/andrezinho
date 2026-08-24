# Identidade visual — Andrezinho

Documento de referência da marca. Os tokens abaixo estão implementados em
[src/app/globals.css](src/app/globals.css) via `@theme` (Tailwind v4) e podem
ser usados como classes utilitárias normais (`bg-brand-600`, `text-ink`,
`font-display`, etc).

## Conceito

Andrezinho não é uma plataforma anônima — é um marketplace com um nome e um
rosto por trás. A identidade precisa equilibrar duas sensações ao mesmo tempo:

- **Confiança/segurança**: por causa do KYC e da conferência física do produto.
- **Proximidade/acessibilidade**: por ser uma marca pessoal, de bairro, feita
  por alguém confiável — não um "app corporativo".

Isso guiou as escolhas abaixo: uma cor de marca verde-azulada (associada a
verificação, segurança, dinheiro/economia) combinada com um laranja terracota
quente (calor humano, chamada para ação, "um cara de confiança"), sobre um
fundo levemente creme (mais pessoal e macio que branco puro).

### Mensagem principal: oportunidade primeiro, conferência depois

O gancho de vendas é **preço de oportunidade** — produtos bem abaixo do
mercado. A conferência física e o KYC não são o argumento principal, são o
*mecanismo* que garante que essa oportunidade vire negócio pago e entregue de
verdade, sem golpe. Na prática:

- Títulos, badges de abertura e citações lideram com oportunidade/preço
  (ex.: "Preço de oportunidade. Negócio de verdade.").
- "Conferência física", "KYC" e "verificação" aparecem como suporte —
  explicando *como* a oportunidade vira negócio seguro — nunca como a
  primeira frase de uma seção.
- O Andrezinho (pessoa) encontra a oportunidade; o Andrezinho (plataforma) é
  a ponte que garante que ela seja paga e entregue.

## Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `brand-50`..`brand-900` | `#EAF6F1` → `#083A2A` | Cor primária (verde "conferido"). Base `brand-600 #16795A`. Botões primários, links, ícone de verificação, navbar. |
| `accent-100`..`accent-700` | `#FCE7D2` → `#A45514` | Cor secundária (laranja terracota). Base `accent-500 #E6832B`. CTAs de compra, preço final, destaques, badges de economia. |
| `cream` | `#FBF8F3` | Fundo padrão das páginas — mais quente que branco puro. |
| `cream-dark` | `#F3EEE4` | Fundo de seções alternadas / cards sobre `cream`. |
| `ink` | `#1B2621` | Texto principal — preto esverdeado, não preto puro. |
| `ink-soft` | `#5B6B64` | Texto secundário, legendas, metadados. |
| `line` | `#E4DFD3` | Bordas e divisores. |
| `status-info` | `#3B82F6` | Único uso de azul: etapas neutras/informativas do pedido (ex. "a caminho da conferência"). Não é cor de marca. |
| `status-danger` | `#C0392B` | Erros, reprovação na conferência. |

Regra prática: **verde = confirmado/positivo**, **laranja = ação/dinheiro**,
azul é usado com moderação só para status neutros, vermelho só para
erro/reprovação. Isso mantém a paleta com significado consistente em vez de
decorativo.

## Tipografia

- **Display / títulos** — [Fraunces](https://fonts.google.com/specimen/Fraunces)
  (serifada, variável, com personalidade). Usada em `h1`–`h3`, hero, wordmark
  do logo. Uma serifada quebra o clichê de marketplace 100% sans-serif
  genérico e reforça a ideia de "marca pessoal, assinada por alguém" —
  aplicada com peso `semibold`/`medium`, às vezes em itálico para dar tom de
  voz mais humano (ex. citações do Andrezinho, selo "conferido por mim").
- **Corpo / UI** — [Inter](https://fonts.google.com/specimen/Inter). Usada em
  parágrafos, formulários, navegação, preços, botões — precisa ser
  extremamente legível em telas pequenas (mobile-first).

Classes utilitárias: `font-display` (Fraunces) e `font-sans` (Inter, padrão
do `body`).

## Logo

Por enquanto só tipográfico: wordmark `andrezinho` em `font-display`
minúsculo, acompanhado de um selo circular (ícone `BadgeCheck` do
lucide-react) em `brand-600`, representando o "conferido pelo Andrezinho".
Implementado em [src/components/layout/Logo.tsx](src/components/layout/Logo.tsx).

## Componentes

- **Botões**: cantos bem arredondados (`rounded-full` na maioria dos CTAs),
  sem sombras duras — transmite acessibilidade, não "corporativo". Primário
  = `brand-600`; CTA de compra/ação principal = `accent-500` (laranja, para
  destacar do resto da UI que é predominantemente verde/neutro).
- **Cards**: fundo branco sobre `cream`, borda `line` sutil, `rounded-2xl`,
  sombra suave só no hover — parecem "objetos físicos" (produtos reais), não
  blocos de formulário.
- **Badges/selo de confiança**: pílula pequena com ícone `ShieldCheck` +
  texto curto ("Conferência física garantida"), sempre em `brand`, nunca em
  `accent` — reserva o laranja só para ação/preço.
- **Ícones**: [lucide-react](https://lucide.dev), traço fino (`strokeWidth`
  padrão), sem preenchimento — combina com a leveza da tipografia Inter.

## Preço e transparência

Regra de negócio refletida na UI ([src/lib/pricing.ts](src/lib/pricing.ts)):
sempre mostrar preço do vendedor **e** o total com a taxa de intermediação de
6%, nunca só o total. Convenção visual: preço do vendedor em `ink-soft`
menor/tachado quando junto do total; preço final sempre em destaque
(`accent-600`, maior, `font-display`).
