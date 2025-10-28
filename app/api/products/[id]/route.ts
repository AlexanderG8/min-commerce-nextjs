import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(
    request: NextRequest,
    {params} : {params: {id : string}}
){
    try{
        // Convertir a número
        const productId = parseInt(params.id);
        // Validar ID
        if(isNaN(productId)){
            return NextResponse.json(
                {error: 'ID de producto inválido'},
                {status: 400}
            );
        }
        const product = await prisma.product.findUnique({
            where: { id: productId }
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
        console.error('Error al obtener producto:', error);
        return NextResponse.json(
            {error: 'Error al obtener producto'},
            {status: 500}
        );
    }
}

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(
    request: NextRequest,
    {params}: {params : {id: string}}
){
    try {
        const body = await request.json();
        // Convertir a número
        const productId = parseInt(params.id);
        // Validar ID
        if(isNaN(productId)){
            return NextResponse.json(
                {error: 'ID de producto inválido'},
                {status: 400}
            );
        }
        // Buscar producto
        const existingProduct = await prisma.product.findUnique({
            where: {id: productId},
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
            where: {id: productId},
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
    {params}: {params: {id : string}}
){
    try {
        // Convertir a número
        const productId = parseInt(params.id);
        // Validar ID
        if(isNaN(productId)){
            return NextResponse.json(
                {error: 'ID de producto inválido'},
                {status: 400}
            );
        }
        // Buscar producto
        const existingProduct = await prisma.product.findUnique({
            where: {id : productId},
        });
        // Validar si existe
        if(!existingProduct){
            return NextResponse.json(
                {error: 'Producto no encontrado'},
                {status: 404}
            );
        }
        // Validar si hay pedidos con este producto
        const orderItemsWithProduct = await prisma.orderItem.findMany({
            where: {productId: productId},
        });
        if(orderItemsWithProduct.length > 0){
            return NextResponse.json(
                {error: 'No se puede eliminar el producto porque cuenta con pedidos.'},
                {status: 400}
            );
        }
        // Eliminar producto
        await prisma.product.delete({
            where: {id : productId}
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