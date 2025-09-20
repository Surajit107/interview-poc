// Order Types
export interface OrderItem {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    category: string;
    stockQuantity: number;
    lowStockThreshold: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAgent?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  currentOrders: number;
}

// Order State Types
export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  deliveryAgents: DeliveryAgent[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

// Order Action Types
export interface OrderFilters {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderPagination {
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusPayload {
  id: string;
  status: OrderStatus;
}

export interface AssignDeliveryAgentPayload {
  orderId: string;
  agentId: string;
}

// Order Statistics
export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
}
