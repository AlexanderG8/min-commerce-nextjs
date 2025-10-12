import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Definición de tipo para los parámetros
type RouteParams = {
  params: {
    id: string;
  };
};

// GET /api/orders/[id] - Obtener una orden por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Acceder al ID directamente desde params
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { error: "ID de orden no proporcionado" },
        { status: 400 }
      );
    }
    
    // Convertir el ID a número entero
    const orderIdInt = parseInt(orderId, 10);
    
    if (isNaN(orderIdInt)) {
      return NextResponse.json(
        { error: "ID de orden inválido" },
        { status: 400 }
      );
    }
    
    const order = await prisma.order.findUnique({
      where: { id: orderIdInt },
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
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al obtener orden:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos de la orden" },
      { status: 500 }
    );
  }
}