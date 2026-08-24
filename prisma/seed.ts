import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const SENHA_PADRAO = "andrezinho123";
const DOC_PLACEHOLDER =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#e4dfd3"/></svg>'
  ).toString("base64");

async function main() {
  const senhaHash = await bcrypt.hash(SENHA_PADRAO, 10);

  const andrezinho = await db.user.upsert({
    where: { email: "andrezinho@andrezinho.com" },
    update: {},
    create: {
      nome: "Andrezinho",
      email: "andrezinho@andrezinho.com",
      senhaHash,
      cpf: "000.000.000-00",
      telefone: "(15) 99999-0000",
      cidade: "Sorocaba, SP",
      endereco: "Endereço do ponto de conferência, Sorocaba, SP",
      fotoDocumento: DOC_PLACEHOLDER,
      isAdmin: true,
    },
  });

  const vendedores = [
    { nome: "Marcos Silva", email: "marcos@exemplo.com", cidade: "Sorocaba, SP" },
    { nome: "Fernanda Costa", email: "fernanda@exemplo.com", cidade: "Sorocaba, SP" },
    { nome: "Roberto Alves", email: "roberto@exemplo.com", cidade: "Votorantim, SP" },
    { nome: "Juliana Prado", email: "juliana@exemplo.com", cidade: "Sorocaba, SP" },
    { nome: "Diego Martins", email: "diego@exemplo.com", cidade: "Itu, SP" },
    { nome: "Lucas Ferreira", email: "lucas@exemplo.com", cidade: "Sorocaba, SP" },
  ];

  const usuarios: Record<string, string> = { andrezinho: andrezinho.id };

  for (const v of vendedores) {
    const user = await db.user.upsert({
      where: { email: v.email },
      update: {},
      create: {
        nome: v.nome,
        email: v.email,
        senhaHash,
        cpf: "111.111.111-11",
        telefone: "(15) 98888-1111",
        cidade: v.cidade,
        endereco: `Endereço de ${v.nome}, ${v.cidade}`,
        fotoDocumento: DOC_PLACEHOLDER,
      },
    });
    usuarios[v.email] = user.id;
  }

  const produtos = [
    {
      titulo: "iPhone 13 128GB Meia-noite",
      descricao:
        "iPhone 13 128GB na cor meia-noite, usado por 1 ano, sempre com película e capinha. Bateria a 89% de saúde. Acompanha carregador original e caixa.",
      categoria: "eletronicos",
      preco: 3500,
      vendedor: "marcos@exemplo.com",
    },
    {
      titulo: "Notebook Dell Inspiron i5 8GB SSD 256GB",
      descricao:
        "Notebook Dell Inspiron 15, Intel i5 10ª geração, 8GB RAM, SSD 256GB. Ótimo estado, ideal para trabalho e estudo. Poucos meses de uso.",
      categoria: "informatica",
      preco: 2200,
      vendedor: "fernanda@exemplo.com",
    },
    {
      titulo: "Geladeira Brastemp Frost Free 375L",
      descricao:
        "Geladeira duplex Brastemp 375L, frost free, poucos riscos de uso. Funcionando perfeitamente, motivo da venda é mudança de casa.",
      categoria: "eletrodomesticos",
      preco: 1800,
      vendedor: "roberto@exemplo.com",
    },
    {
      titulo: "Sofá Retrátil 3 Lugares Cinza",
      descricao:
        "Sofá retrátil e reclinável, 3 lugares, tecido suede cinza. Muito confortável, sem manchas ou rasgos. Retirada facilitada.",
      categoria: "moveis",
      preco: 950,
      vendedor: "juliana@exemplo.com",
    },
    {
      titulo: "Bicicleta Speed Caloi 10 Alumínio",
      descricao:
        "Bicicleta speed Caloi 10, quadro em alumínio, 21 marchas Shimano. Revisada recentemente, pneus novos.",
      categoria: "esportes",
      preco: 1400,
      vendedor: "diego@exemplo.com",
    },
    {
      titulo: "PlayStation 5 Standard + 2 Controles",
      descricao:
        "PS5 edição padrão com leitor de disco, acompanha 2 controles DualSense originais e 3 jogos físicos. Tudo funcionando perfeitamente.",
      categoria: "games",
      preco: 2900,
      vendedor: "lucas@exemplo.com",
    },
    {
      titulo: "Jaqueta de Couro Legítimo Tamanho M",
      descricao:
        "Jaqueta de couro legítimo, cor preta, tamanho M. Usada poucas vezes, sem desgaste. Modelo clássico atemporal.",
      categoria: "moda",
      preco: 480,
      vendedor: "marcos@exemplo.com",
    },
    {
      titulo: 'Smart TV Samsung 55" 4K',
      descricao:
        "Smart TV Samsung Crystal UHD 55 polegadas, 4K, poucos meses de uso, com nota fiscal e garantia de fábrica ainda ativa.",
      categoria: "eletronicos",
      preco: 2100,
      vendedor: "fernanda@exemplo.com",
    },
  ];

  for (const p of produtos) {
    const existente = await db.produto.findFirst({ where: { titulo: p.titulo } });
    if (existente) continue;
    await db.produto.create({
      data: {
        titulo: p.titulo,
        descricao: p.descricao,
        categoria: p.categoria,
        preco: p.preco,
        fotos: "[]",
        vendedorId: usuarios[p.vendedor],
      },
    });
  }

  console.log("Seed concluído.");
  console.log(`Login admin: andrezinho@andrezinho.com / senha: ${SENHA_PADRAO}`);
  console.log(`Login vendedores de teste: <email acima> / senha: ${SENHA_PADRAO}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
