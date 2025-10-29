import { prisma } from '@/lib/prisma';

export type ActivityAction = 'LOGIN' | 'ORDER_CREATED';

export interface ActivityMetadata {
  orderId?: number;
  orderTotal?: number;
  orderItems?: number;
  [key: string]: any;
}

/**
 * Registra una actividad del usuario en el log
 */
export async function logUserActivity(
  userId: number,
  action: ActivityAction,
  description: string,
  metadata?: ActivityMetadata
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        description,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });
  } catch (error) {
    console.error('Error al registrar actividad del usuario:', error);
    // No lanzamos el error para no interrumpir el flujo principal
  }
}

/**
 * Obtiene las actividades recientes de un usuario
 */
export async function getUserRecentActivities(
  userId: number,
  limit: number = 10
) {
  try {
    return await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Error al obtener actividades del usuario:', error);
    return [];
  }
}

/**
 * Obtiene estadísticas del usuario basadas en sus órdenes
 */
export async function getUserStatistics(userId: number) {
  try {
    const [orderCount, totalSpent] = await Promise.all([
      prisma.order.count({
        where: { userId },
      }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders: orderCount,
      totalSpent: totalSpent._sum.total || 0,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas del usuario:', error);
    return {
      totalOrders: 0,
      totalSpent: 0,
    };
  }
}