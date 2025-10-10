import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products - Obtener todos los productos
export async function GET(){
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json(products);
    } catch(error){
        console.error('Error al obtener los productos:', error);
        return NextResponse.json(
            {error : 'Error al obtener productos'},
            {status : 500}
        );
    }
}

// POST api/products - Crear un nuevo producto
export async function POST(request : NextRequest){
    try {
        const body = await request.json();
        // Validar si se proporcionaron todos los campos requeridos
        if (!body.name || !body.description || !body.price || !body.stock){
            return NextResponse.json(
                {error: 'Nombre, precio, descripción y stock son requeridos'},
                {status: 400}
            );
        }
        // Crear producto
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description || '',
                price: parseFloat(body.price),
                stock: parseInt(body.stock),
                imageUrl: body.imageUrl || null,
            },
        });
        // Retornar respuesta exitosa
        return NextResponse.json(
            product,
            {status : 201}
        );
    } catch (error) {
        console.error('Error al crear producto:', error);
        return NextResponse.json(
            {error: 'Error al crear producto'},
            {status: 500}
        );
    }
}

