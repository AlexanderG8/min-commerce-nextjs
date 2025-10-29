import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Base de datos limpiada. Creando usuarios...');

  // Crear usuarios de ejemplo
  const users = [
    {
      email: 'admin@example.com',
      name: 'Administrador',
      role: 'admin',
    },
    {
      email: 'juan.perez@email.com',
      name: 'Juan Pérez',
      role: 'user',
    },
    {
      email: 'maria.garcia@email.com',
      name: 'María García',
      role: 'user',
    },
    {
      email: 'carlos.lopez@email.com',
      name: 'Carlos López',
      role: 'user',
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    createdUsers.push(createdUser);
  }

  console.log('Usuarios creados correctamente');

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

  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    createdProducts.push(createdProduct);
  }

  console.log('Productos creados correctamente');

  // Crear órdenes de ejemplo
  const orders = [
    {
      userId: createdUsers[1].id, // Juan Pérez
      clientName: 'Juan Pérez',
      clientEmail: 'juan.perez@email.com',
      clientAddress: 'Calle Principal 123',
      clientCity: 'Madrid',
      clientPostalCode: '28001',
      clientPhone: '+34 600 123 456',
      total: 1799.98,
      items: [
        {
          productId: createdProducts[0].id, // Laptop Pro
          quantity: 1,
          price: 1299.99,
        },
        {
          productId: createdProducts[3].id, // Auriculares
          quantity: 2,
          price: 199.99,
        },
      ],
    },
    {
      userId: createdUsers[2].id, // María García
      clientName: 'María García',
      clientEmail: 'maria.garcia@email.com',
      clientAddress: 'Avenida Libertad 456',
      clientCity: 'Barcelona',
      clientPostalCode: '08001',
      clientPhone: '+34 600 789 012',
      total: 1399.98,
      items: [
        {
          productId: createdProducts[1].id, // Smartphone X
          quantity: 1,
          price: 899.99,
        },
        {
          productId: createdProducts[2].id, // Tablet Ultra
          quantity: 1,
          price: 499.99,
        },
      ],
    },
    {
      userId: createdUsers[3].id, // Carlos López
      clientName: 'Carlos López',
      clientEmail: 'carlos.lopez@email.com',
      clientAddress: 'Plaza Mayor 789',
      clientCity: 'Valencia',
      clientPostalCode: '46001',
      clientPhone: '+34 600 345 678',
      total: 549.98,
      items: [
        {
          productId: createdProducts[4].id, // Monitor 4K
          quantity: 1,
          price: 349.99,
        },
        {
          productId: createdProducts[3].id, // Auriculares
          quantity: 1,
          price: 199.99,
        },
      ],
    },
  ];

  for (const orderData of orders) {
    const { items, ...orderInfo } = orderData;
    
    const createdOrder = await prisma.order.create({
      data: orderInfo,
    });

    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          ...item,
          orderId: createdOrder.id,
        },
      });
    }
  }

  console.log('Órdenes creadas correctamente');
  console.log('Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });