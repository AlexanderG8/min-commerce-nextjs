import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// GET /api/orders - Obtener todas las ordenes
export async function GET(request: NextRequest){
    try {
        const session = await auth();
        
        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Opcionalmente filtrar por email del cliente
        const {searchParams} = new URL(request.url);
        const clientEmail = searchParams.get('clientEmail');

        let where: any = {};

        // Si es admin, puede ver todas las órdenes o filtrar por email
        if (session.user.role === 'admin') {
            if (clientEmail) {
                where.clientEmail = clientEmail;
            }
        } else {
            // Si es usuario normal, solo puede ver sus propias órdenes
            where.userId = parseInt(session.user.id);
        }

        const orders = await prisma.order.findMany({
            where,
            select: {
                id: true,
                clientName: true,
                clientEmail: true,
                total: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                name: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy:{
                id: 'desc'
            }
        });

        // Transformar los datos para incluir el conteo de items
        const ordersWithItemCount = orders.map(order => ({
            id: order.id,
            clientName: order.clientName,
            clientEmail: order.clientEmail,
            total: order.total,
            createdAt: order.createdAt,
            user: order.user,
            itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
            items: order.items
        }));

        return NextResponse.json(ordersWithItemCount);
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
        const session = await auth();
        
        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        // Obtener datos del usuario logueado
        const user = await prisma.user.findUnique({
            where: { id: parseInt(session.user.id) }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Usar datos del usuario logueado como predeterminados, pero permitir override
        const clientName = body.clientName || user.name || user.email.split('@')[0];
        const clientEmail = body.clientEmail || user.email;

        // Validación
        if(!clientName || !clientEmail || !body.clientAddress || !body.clientCity || !body.clientPostalCode || !body.clientPhone || !body.items || body.items.length === 0){
            return NextResponse.json(
                {error: "Nombre del cliente, email, dirección, ciudad, código postal, teléfono y al menos un item son requeridos"},
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
            // Crear la orden asociada al usuario logueado
            const newOrder = await tx.order.create({
                data: {
                    userId: parseInt(session.user.id), // Asociar con el usuario logueado
                    clientName,
                    clientEmail,
                    clientAddress: body.clientAddress,
                    clientCity: body.clientCity,
                    clientPostalCode: body.clientPostalCode,
                    clientPhone: body.clientPhone,
                    total,
                    items: {
                        create: itemsWithDetails
                    }
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    imageUrl: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
            
            // Actualizar el stock de cada producto
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

