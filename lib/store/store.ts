// Aquí estoy implementando el store de zustand para manejar el estado del carrito de compras
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Defino el tipo para un ítem en el carrito
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};
// Defino el tipo para el store del carrito
type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};
// Creo el store del carrito
export const useCartStore = create<CartStore>()(
  persist(
    // Defino el estado inicial del carrito
    (set, get) => ({
      items: [],
      // Método para agregar un ítem al carrito
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        
        return {
          items: [...state.items, { ...item, quantity: 1 }],
        };
      }),
      // Método para remover un ítem del carrito
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      // Método para actualizar la cantidad de un ítem en el carrito
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      // Método para vaciar el carrito
      clearCart: () => set({ items: [] }),
      // Método para obtener el total de ítems en el carrito
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      // Método para obtener el precio total de los ítems en el carrito
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);