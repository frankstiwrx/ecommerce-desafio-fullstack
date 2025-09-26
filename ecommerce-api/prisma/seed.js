const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});

  const products = [
    {
      name: 'Camiseta Básica',
      description: 'Algodão 100%, corte unissex.',
      price: new Prisma.Decimal('59.90'),
      stock: 50,
    },
    {
      name: 'Tênis Runner',
      description: 'Leve e confortável para o dia a dia.',
      price: new Prisma.Decimal('299.90'),
      stock: 25,
    },
    {
      name: 'Mochila Urbana',
      description: 'Compartimento para notebook 15”.',
      price: new Prisma.Decimal('189.00'),
      stock: 30,
    },
    {
      name: 'Fone Bluetooth',
      description: 'Bateria 24h, cancelamento de ruído.',
      price: new Prisma.Decimal('349.00'),
      stock: 15,
    },
    {
      name: 'Garrafa Térmica 1L',
      description: 'Aço inox, mantém gelado por 24h.',
      price: new Prisma.Decimal('119.90'),
      stock: 40,
    },
  ];

  await prisma.product.createMany({ data: products });
  console.log('✅ Seed de produtos inserido.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
