import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(
    request: NextRequest,
    {params} : {params: {id : number}}
){
    try{
        const product = await prisma.product.findUnique({
            where: { id: params.id }
        });
        // Validamos
        if(!product){
            return NextResponse.json(
                {error: 'Producto no encontrado'},
                {status: 404}
            );
        }
        return NextResponse.json(product);
    } catch(error){

    }
}

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(
    request: NextRequest,
    {params}: {params : {id: number}}
){
    try {
        const body = await request.json();
        // Buscar producto
        const existingProduct = await prisma.product.findUnique({
            where: {id: params.id},
        });
        //Validar si existe
        if(!existingProduct){
            return NextResponse.json(
                {error: 'Producto no encontrado'},
                {status: 404}
            );
        }
        // Actualizar producto
        const updatedProduct = await prisma.product.update({
            where: {id: params.id},
            data: {
                name: body.name !== undefined ? body.name : existingProduct.name,
                description: body.description !== undefined ? body.description : existingProduct.description,
                price: body.price !== undefined ? parseFloat(body.price) : existingProduct.price,
                stock: body.stock !== undefined ? parseInt(body.stock) : existingProduct.stock,
                imageUrl: body.imageUrl !== undefined ? body.imageUrl : existingProduct.imageUrl,
            }
        });
        // Retornar respuesta exitosa
        return NextResponse.json(
            updatedProduct,
            {status: 200}
        );
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return NextResponse.json(
            {error: 'Error al actualizar producto'},
            {status: 500}
        );
    }
}

// DELETE /api/products/[id] - Eliminar un producto
export async function DELETE(
    request: NextRequest,
    {params}: {params: {id : number}}
){
    try {
        // Buscar producto
        const existingProduct = await prisma.product.findUnique({
            where: {id : params.id},
        });
        // Validar si existe
        if(!existingProduct){
            return NextResponse.json(
                {error: 'Producto no encontrado'},
                {status: 404}
            );
        }
        // Eliminar producto
        await prisma.product.delete({
            where: {id : params.id}
        });
        // Retornar respuesta exitosa
        return NextResponse.json(
            {message: 'Producto eliminado exitosamente'},
            {status: 200}
        );
    } catch (error) {
        console.error('Error al eliminar producto', error);
        return NextResponse.json(
            {error: 'Error al eliminar producto'},
            {status: 500}
        );
    }
};