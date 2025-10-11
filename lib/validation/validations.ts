// Aquí voy a crear esquemas de validación para los formularios y las APIs con Zod
import { z } from 'zod';

// Esquema para validar productos
export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  imageUrl: z.string().url().optional().nullable(),
});
// Tipo para los valores del formulario de productos
export type ProductFormValues = z.infer<typeof productSchema>;

// Esquema para validar items de orden
export const orderItemSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

// Esquema para validar órdenes
export const orderSchema = z.object({
  clientName: z.string().min(1, 'El nombre del cliente es requerido'),
  clientEmail: z.string().email('Email inválido'),
  items: z.array(orderItemSchema).nonempty('Debe incluir al menos un producto'),
});
// Tipo para los valores del formulario de órdenes
export type OrderFormValues = z.infer<typeof orderSchema>;

// Esquema para validar el formulario de checkout
export const checkoutFormSchema = z.object({
  clientName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  clientEmail: z.string().email('Email inválido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  postalCode: z.string().min(3, 'El código postal es requerido'),
  country: z.string().min(2, 'El país es requerido'),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;