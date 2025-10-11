import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders - Obtener todas las ordenes
export async function GET(request: NextRequest){
    try {
        // Opcionalmente filtrar por email del cliente
        const {searchParams} = new URL(request.url);
        const clientEmail = searchParams.get('clientEmail');

        const where = clientEmail ? {clientEmail} : {};

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product : true
                    }
                }
            },
            orderBy:{
                id: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error al obtener ordenes", error);
        return NextResponse.json(
            {error: "Error al obtener los datos"},
            {status: 500}
        );
    }
}

export async function POST(request: NextRequest){
    try {
        const body = await request.json();
        // Validación
        if(!body.clientName || !body.clientEmail || !body.items || body.items.length === 0){
            return NextResponse.json(
                {error: "Nombre del cliente, email y al menos un item son requeridos"},
                {status: 400}
            );
        }
        // Verificar stock y calcular total
        let total = 0;
        const itemsWithDetails = [];
        
        // Procesar cada item
        for(const item of body.items){
            const product = await prisma.product.findUnique({
                where: {id: item.productId}
            });
            if(!product){
                return NextResponse.json(
                    {error: `Producto con ID ${item.productId} no encontrado`},
                    {status: 404}
                );
            }
            // Verificar stock
            if(product.stock < item.quantity){
                return NextResponse.json(
                    {error: `Stock insuficiente para el producto ${product.name}`},
                    {status: 400}
                );
            }
            // Calcular total
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            // Añadir detalles del item
            itemsWithDetails.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Crear la orden con una transacción para asegurar consistencia
        const order = await prisma.$transaction(async (tx) => {
            // Crear la orden
            const newOrder = await tx.order.create({
                data: {
                    clientName: body.clientName,
                    clientEmail: body.clientEmail,
                    total,
                    items: {
                        create: itemsWithDetails
                    }
                },
                include: {
                    items: true
                }
            });
            // Actualiar el stock de cada producto
            for(const item of body.items){
                await tx.product.update({
                    where: {id: item.productId},
                    data:{
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            return newOrder;
        });
        return NextResponse.json(order, {status:201});
    } catch (error) {
        console.error("Error al crear la orden", error);
        return NextResponse.json(
            {error: "Error al crear la orden"},
            {status: 500}
        );
    }
}

