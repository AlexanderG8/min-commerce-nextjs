export interface ActivityLog {
  id: number;
  userId: number;
  action: 'LOGIN' | 'ORDER_CREATED';
  description: string;
  metadata?: {
    orderId?: number;
    orderTotal?: number;
    orderItems?: number;
    [key: string]: any;
  } | null;
  createdAt: string;
}

export interface UserStatistics {
  totalOrders: number;
  totalSpent: number;
}

export interface ActivityDisplayItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'login' | 'order';
  metadata?: any;
}