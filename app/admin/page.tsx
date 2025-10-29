"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: number;
  clientName: string;
  clientEmail: string;
  total: number;
  createdAt: string;
  itemCount: number;
}

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface DetailedOrder {
  id: number;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientCity: string;
  clientPostalCode: string;
  clientPhone: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Estados
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  
  // Estados para los detalles de orden
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Verificar autorización
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }
    
    fetchData();
  }, [session, status, router]);

  // Obtener detalles de una orden específica
  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoadingOrderDetails(true);
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (response.ok) {
        const orderData = await response.json();
        setSelectedOrder(orderData);
        setShowOrderDetails(true);
      } else {
        toast.error('Error al cargar los detalles de la orden');
      }
    } catch (error) {
      console.error('Error al cargar detalles de orden:', error);
      toast.error('Error al cargar los detalles de la orden');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  // Cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar formulario de producto
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });
      
      if (response.ok) {
        toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar producto');
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Producto eliminado');
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  // Editar producto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    });
    setShowProductForm(true);
  };

  // Calcular estadísticas
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona productos y órdenes de tu tienda</p>
      </div>

      {/* Navegación de pestañas */}
      <div className="flex space-x-1 mb-8">
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dashboard')}
          title="Ver dashboard"
        >
          Dashboard
        </Button>
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
          title="Ver productos"
        >
          Productos
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          onClick={() => setActiveTab('orders')}
          title="Ver órdenes"
        >
          Órdenes
        </Button>
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockProducts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Productos con stock bajo */}
          {lowStockProducts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Bajo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products
                    .filter(p => p.stock < 10)
                    .map(product => (
                      <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{product.name}</span>
                        <Badge variant="destructive">Stock: {product.stock}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Gestión de Productos */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestión de Productos</h2>
            <Button onClick={() => setShowProductForm(true)} title="Agregar nuevo producto">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {/* Formulario de producto */}
          {showProductForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">URL de Imagen</Label>
                      <Input
                        id="imageUrl"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingProduct ? 'Actualizar' : 'Crear'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Tabla de productos */}
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock < 10 ? 'destructive' : 'default'}>
                          {product.stock < 10 ? 'Stock Bajo' : 'Disponible'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            title="Editar producto"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            title="Eliminar producto"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gestión de Órdenes */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestión de Órdenes</h2>
          </div>

          {/* Card de detalles de orden (no modal) */}
          {showOrderDetails && selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Ordenn #{selectedOrder.id}</CardTitle>
                <p className="text-muted-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información del cliente */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Información del Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{selectedOrder.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{selectedOrder.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{selectedOrder.clientAddress}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Ciudad y Código Postal</p>
                      <p className="font-medium">{selectedOrder.clientCity}, {selectedOrder.clientPostalCode}</p>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Productos Ordenados</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total de la Orden:</span>
                    <span className="text-2xl">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botón de cerrar */}
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowOrderDetails(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabla de órdenes */}
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell className="font-medium">{order.clientName}</TableCell>
                      <TableCell>{order.clientEmail}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{order.itemCount}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Ver detalles de la orden"
                          onClick={() => fetchOrderDetails(order.id)}
                          disabled={loadingOrderDetails}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}