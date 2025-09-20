import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus, DeliveryAgent, PaginatedResponse, PaginationParams } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1-555-0123',
    deliveryAddress: '123 Main St, City, State 12345',
    items: [
      {
        product: {
          id: '1',
          name: 'Premium Coffee Beans',
          sku: 'COF-001',
          price: 24.99,
          category: 'Beverages',
          stockQuantity: 45,
          lowStockThreshold: 10,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 2,
        price: 24.99,
      },
    ],
    subtotal: 49.98,
    tax: 4.00,
    total: 53.98,
    status: 'CONFIRMED',
    deliveryAgent: 'Agent-001',
    estimatedDelivery: '2024-01-15T14:00:00Z',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+1-555-0124',
    deliveryAddress: '456 Oak Ave, City, State 12345',
    items: [
      {
        product: {
          id: '2',
          name: 'Organic Green Tea',
          sku: 'TEA-002',
          price: 18.50,
          category: 'Beverages',
          stockQuantity: 5,
          lowStockThreshold: 10,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1,
        price: 18.50,
      },
    ],
    subtotal: 18.50,
    tax: 1.48,
    total: 19.98,
    status: 'OUT_FOR_DELIVERY',
    deliveryAgent: 'Agent-002',
    estimatedDelivery: '2024-01-15T16:00:00Z',
    createdAt: '2024-01-15T09:15:00Z',
  },
];

const mockDeliveryAgents: DeliveryAgent[] = [
  {
    id: 'Agent-001',
    name: 'Mike Johnson',
    phone: '+1-555-0201',
    isAvailable: true,
    currentOrders: 2,
  },
  {
    id: 'Agent-002',
    name: 'Sarah Wilson',
    phone: '+1-555-0202',
    isAvailable: true,
    currentOrders: 1,
  },
  {
    id: 'Agent-003',
    name: 'David Brown',
    phone: '+1-555-0203',
    isAvailable: false,
    currentOrders: 0,
  },
];

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredOrders = [...mockOrders];

      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredOrders = filteredOrders.filter(
          order =>
            order.customerName.toLowerCase().includes(searchLower) ||
            order.id.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (params.sortBy) {
        filteredOrders.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Order];
          const bValue = b[params.sortBy as keyof Order];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return params.sortOrder === 'desc'
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          }

          return 0;
        });
      }

      // Apply pagination
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      const response: PaginatedResponse<Order> = {
        data: paginatedOrders,
        total: filteredOrders.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(filteredOrders.length / params.limit),
      };

      return response;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: string; status: OrderStatus }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderIndex = mockOrders.findIndex(o => o.id === id);
      if (orderIndex === -1) {
        return rejectWithValue('Order not found');
      }

      const updatedOrder = {
        ...mockOrders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      mockOrders[orderIndex] = updatedOrder;

      return updatedOrder;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const assignDeliveryAgent = createAsyncThunk(
  'orders/assignAgent',
  async ({ orderId, agentId }: { orderId: string; agentId: string }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        return rejectWithValue('Order not found');
      }

      const agent = mockDeliveryAgents.find(a => a.id === agentId);
      if (!agent || !agent.isAvailable) {
        return rejectWithValue('Delivery agent not available');
      }

      const updatedOrder = {
        ...mockOrders[orderIndex],
        deliveryAgent: agentId,
        status: 'OUT_FOR_DELIVERY' as OrderStatus,
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      };

      mockOrders[orderIndex] = updatedOrder;

      // Update agent's current orders count
      agent.currentOrders += 1;

      return updatedOrder;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchDeliveryAgents = createAsyncThunk(
  'orders/fetchDeliveryAgents',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDeliveryAgents;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

interface OrderState {
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

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  deliveryAgents: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OrderState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<OrderState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign Delivery Agent
    builder
      .addCase(assignDeliveryAgent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignDeliveryAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(assignDeliveryAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Delivery Agents
    builder
      .addCase(fetchDeliveryAgents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryAgents = action.payload;
        state.error = null;
      })
      .addCase(fetchDeliveryAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentOrder, setFilters, setPagination, resetFilters } = orderSlice.actions;
export default orderSlice.reducer;
