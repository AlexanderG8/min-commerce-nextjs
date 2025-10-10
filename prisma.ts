// Aquí estoy inicializando la instancia del cliente Prisma.
import { PrismaClient } from '@prisma/client';

// Esta es una variable global para almacenar la instancia del cliente Prisma.
// Se utiliza para evitar crear múltiples instancias del PrismaClient en modo desarrollo.
const globalForPrisma = global as unknown as { prisma : PrismaClient };

// Exportamos la instancia del cliente Prisma.
export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['query'],
});

// En modo desarrollo, almacenamos la instancia del cliente Prisma en la variable global.
// Esto permite reutilizar la instancia en lugar de crear múltiples instancias.
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
