import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserStatistics } from '@/lib/activity-logger';

// GET /api/users/me/statistics - Obtener estadísticas del usuario actual
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const statistics = await getUserStatistics(parseInt(session.user.id));

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error al obtener estadísticas del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}