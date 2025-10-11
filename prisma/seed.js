const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  console.log('Base de datos limpiada. Creando productos...');

  // Crear productos
  const products = [
    {
      name: 'Laptop Pro',
      description: 'Laptop de alta gama para profesionales',
      price: 1299.99,
      stock: 10,
      imageUrl: 'https://placehold.co/600x400?text=Laptop+Pro',
    },
    {
      name: 'Smartphone X',
      description: 'Smartphone con la última tecnología',
      price: 899.99,
      stock: 15,
      imageUrl: 'https://placehold.co/600x400?text=Smartphone+X',
    },
    {
      name: 'Tablet Ultra',
      description: 'Tablet ligera y potente',
      price: 499.99,
      stock: 20,
      imageUrl: 'https://placehold.co/600x400?text=Tablet+Ultra',
    },
    {
      name: 'Auriculares Noise Cancelling',
      description: 'Auriculares con cancelación de ruido',
      price: 199.99,
      stock: 30,
      imageUrl: 'https://placehold.co/600x400?text=Auriculares',
    },
    {
      name: 'Monitor 4K',
      description: 'Monitor de alta resolución para profesionales',
      price: 349.99,
      stock: 8,
      imageUrl: 'https://placehold.co/600x400?text=Monitor+4K',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Productos creados correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });