import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserRecentActivities } from '@/lib/activity-logger';

// GET /api/users/me/activities - Obtener actividades recientes del usuario actual
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const activities = await getUserRecentActivities(
      parseInt(session.user.id),
      limit
    );

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error al obtener actividades del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}