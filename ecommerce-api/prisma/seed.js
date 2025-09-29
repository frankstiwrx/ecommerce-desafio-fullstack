/* eslint-disable no-console */
const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('⚠️ Limpando dados...');
  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.cart.deleteMany().catch(() => {});
  await prisma.emailVerificationToken.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // =========
  // USUÁRIOS
  // =========
  const passwordHash = await bcrypt.hash('senha123', 10);
  const users = [
    { name: 'novorephyone', email: 'novo@example.com', role: 'ADMIN' },
    { name: 'Frank o ADM', email: 'ecommerce.api.mailer@gmail.com', role: 'ADMIN' },
    { name: 'Admin Root', email: 'admin@example.com', role: 'ADMIN' },
    { name: 'Ana Beatriz', email: 'ana.beatriz@example.com' },
    { name: 'Carlos Henrique', email: 'carlos.henrique@example.com' },
    { name: 'Fernanda Lima', email: 'fernanda.lima@example.com' },
    { name: 'Rafael Santos', email: 'rafael.santos@example.com' },
    { name: 'Patrícia Gomes', email: 'patricia.gomes@example.com' },
    { name: 'Bruno Costa', email: 'bruno.costa@example.com' },
    { name: 'Larissa Souza', email: 'larissa.souza@example.com' },
    { name: 'Gabriel Rocha', email: 'gabriel.rocha@example.com' },
    { name: 'Camila Duarte', email: 'camila.duarte@example.com' },
    { name: 'Marcos Vinícius', email: 'marcos.vinicius@example.com' },
    { name: 'Aline Ferreira', email: 'aline.ferreira@example.com' },
    { name: 'Tiago Almeida', email: 'tiago.almeida@example.com' },
    { name: 'Paula Nogueira', email: 'paula.nogueira@example.com' },
    { name: 'Vitor Hugo', email: 'vitor.hugo@example.com' },
    { name: 'Juliana Barros', email: 'juliana.barros@example.com' },
    { name: 'André Carvalho', email: 'andre.carvalho@example.com' },
    { name: 'Beatriz Figueiredo', email: 'beatriz.figueiredo@example.com' },
    { name: 'Renato Pires', email: 'renato.pires@example.com' },
    { name: 'Sabrina Castro', email: 'sabrina.castro@example.com' },
    { name: 'Felipe Moreira', email: 'felipe.moreira@example.com' },
    { name: 'Natália Moraes', email: 'natalia.moraes@example.com' },
    { name: 'Pedro Augusto', email: 'pedro.augusto@example.com' },
    { name: 'Isabela Martins', email: 'isabela.martins@example.com' },
    { name: 'Lucas Teixeira', email: 'lucas.teixeira@example.com' },
    { name: 'Carolina Reis', email: 'carolina.reis@example.com' },
    { name: 'Eduardo Prado', email: 'eduardo.prado@example.com' },
    { name: 'Helena Ribeiro', email: 'helena.ribeiro@example.com' },
    { name: 'Cauã Mendes', email: 'caua.mendes@example.com' },
    { name: 'Letícia Araújo', email: 'leticia.araujo@example.com' },
  ].map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role ?? 'USER',
    passwordHash,
    isEmailVerified: true,
  }));

  await prisma.user.createMany({ data: users });
  console.log(`✅ ${users.length} usuários inseridos (senha: "senha123").`);

  // =========
  // PRODUTOS
  // =========
  const P = (n) => new Prisma.Decimal(n);

  const products = [
    // Camisas & esportes
    {
      name: 'Camisa Barcelona 23/24',
      description: 'Camisa oficial, tecido dry fit.',
      imageUrl: 'https://images.unsplash.com/photo-1593344482845-2a6b9b21f0ee?q=80&w=800',
      price: P('299.90'),
      stock: 35,
    },
    {
      name: 'Camisa Real Madrid 22/23',
      description: 'Versão torcedor, modelagem confortável.',
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800',
      price: P('279.90'),
      stock: 18,
    },
    {
      name: 'Bola de Futebol Pro',
      description: 'Costura termocolada, excelente controle.',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800',
      price: P('199.90'),
      stock: 40,
    },
    {
      name: 'Chuteira Campo Elite',
      description: 'Cravos firmes e cabedal sintético premium.',
      imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39b9d76f?q=80&w=800',
      price: P('349.00'),
      stock: 22,
    },

    // Tech / Eletrônicos
    {
      name: 'Smartphone X12 128GB',
      description: 'Tela 6.5", câmera dupla, bateria 5000mAh.',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
      price: P('1599.00'),
      stock: 12,
    },
    {
      name: 'Notebook Ultra 15” i7 16GB',
      description: 'SSD 512GB, ideal para produtividade e estudo.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      price: P('4599.00'),
      stock: 7,
    },
    {
      name: 'PC Gamer RTX 4070',
      description: 'Ryzen 7, 32GB RAM, SSD 1TB NVMe, RTX 4070.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
      price: P('8999.00'),
      stock: 4,
    },
    {
      name: 'Placa de Vídeo RTX 4060 Ti',
      description: '8GB GDDR6, ótimo custo/benefício em 1080p/1440p.',
      imageUrl: 'https://images.unsplash.com/photo-1619233461114-c1a0a17f6b8f?q=80&w=800',
      price: P('2799.00'),
      stock: 9,
    },
    {
      name: 'Headset Gamer 7.1',
      description: 'Som surround, microfone com redução de ruído.',
      imageUrl: 'https://images.unsplash.com/photo-1518441902110-965969184b31?q=80&w=800',
      price: P('399.00'),
      stock: 25,
    },
    {
      name: 'Teclado Mecânico RGB',
      description: 'Switches táteis, iluminação personalizável.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      price: P('349.90'),
      stock: 30,
    },
    {
      name: 'Mouse Gamer 16000 DPI',
      description: 'Sensor óptico de alta precisão, 6 botões.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
      price: P('199.90'),
      stock: 45,
    },
    {
      name: 'Monitor 27” 144Hz',
      description: 'IPS, 1ms, bordas finas.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      price: P('1699.00'),
      stock: 10,
    },

    // Casa & acessórios
    {
      name: 'Mochila Urbana',
      description: 'Compartimento para notebook 15”.',
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800',
      price: P('189.00'),
      stock: 30,
    },
    {
      name: 'Garrafa Térmica 1L',
      description: 'Aço inox, mantém gelado por 24h.',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800',
      price: P('119.90'),
      stock: 40,
    },
    {
      name: 'Camiseta Básica',
      description: 'Algodão 100%, corte unissex.',
      imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800',
      price: P('59.90'),
      stock: 50,
    },
    {
      name: 'Jaqueta Corta-vento',
      description: 'Resistente à água, leve e compacta.',
      imageUrl: 'https://images.unsplash.com/photo-1520975922284-9bcd8b85aa25?q=80&w=800',
      price: P('249.90'),
      stock: 20,
    },
    {
      name: 'Relógio Esportivo GPS',
      description: 'Monitor de batimentos e múltiplos esportes.',
      imageUrl: 'https://images.unsplash.com/photo-1518442072042-2db464c4e39d?q=80&w=800',
      price: P('699.00'),
      stock: 14,
    },
    {
      name: 'Fone Bluetooth',
      description: 'Bateria 24h, cancelamento de ruído.',
      imageUrl: 'https://images.unsplash.com/photo-1518441902110-965969184b31?q=80&w=800',
      price: P('349.00'),
      stock: 15,
    },

    // Mais tech
    {
      name: 'SSD NVMe 1TB',
      description: 'Leitura 3500MB/s, escrita 3000MB/s.',
      imageUrl: 'https://images.unsplash.com/photo-1587202372775-98927b875e49?q=80&w=800',
      price: P('479.00'),
      stock: 26,
    },
    {
      name: 'HD Externo 2TB',
      description: 'USB 3.0, compacto e portátil.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800',
      price: P('419.90'),
      stock: 18,
    },
    {
      name: 'Roteador Wi-Fi 6',
      description: 'Dual-band, OFDMA, MU-MIMO.',
      imageUrl: 'https://images.unsplash.com/photo-1586816879360-00c3b1a3d54f?q=80&w=800',
      price: P('629.00'),
      stock: 16,
    },
    {
      name: 'Kindle Paperwhite',
      description: 'Tela 300 ppi, luz ajustável, à prova d’água.',
      imageUrl: 'https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=800',
      price: P('699.00'),
      stock: 11,
    },

    // Fitness & lazer
    {
      name: 'Bicicleta Urbana Aro 29',
      description: 'Quadro alumínio, 21 marchas.',
      imageUrl: 'https://images.unsplash.com/photo-1515444021641-7498f04b7b39?q=80&w=800',
      price: P('2399.00'),
      stock: 5,
    },
    {
      name: 'Skate Profissional',
      description: 'Shape maple, trucks alumínio.',
      imageUrl: 'https://images.unsplash.com/photo-1516900557549-41557d405adf?q=80&w=800',
      price: P('499.00'),
      stock: 13,
    },
    {
      name: 'Patins In-Line',
      description: 'Bota confortável, rolamentos ABEC-7.',
      imageUrl: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=800',
      price: P('389.90'),
      stock: 17,
    },
    {
      name: 'Barraca 3 Pessoas',
      description: 'Impermeável, montagem rápida.',
      imageUrl: 'https://images.unsplash.com/photo-1504280390368-3971e38c98fa?q=80&w=800',
      price: P('549.00'),
      stock: 8,
    },
  ];

  await prisma.product.createMany({ data: products });
  console.log(`✅ ${products.length} produtos inseridos.`);

  console.log('🌱 Seed concluído com sucesso.');
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
