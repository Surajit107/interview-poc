import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData, KPIData, ChartData, Product } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

// Mock data
const mockKPIData: KPIData = {
  totalOrders: { value: 1247, change: '+12.5%' },
  monthlyIncome: { value: 45670.50, change: '+8.2%' },
  activeProducts: { value: 156, change: '-2' },
  pendingDeliveries: { value: 23, change: '+5' },
};

const mockRevenueChart: ChartData[] = [
  { month: 'Jan', revenue: 35000 },
  { month: 'Feb', revenue: 42000 },
  { month: 'Mar', revenue: 38000 },
  { month: 'Apr', revenue: 45000 },
  { month: 'May', revenue: 52000 },
  { month: 'Jun', revenue: 48000 },
];

const mockOrderStatusDistribution = [
  { status: 'PENDING' as const, count: 15 },
  { status: 'CONFIRMED' as const, count: 45 },
  { status: 'PREPARING' as const, count: 12 },
  { status: 'OUT_FOR_DELIVERY' as const, count: 23 },
  { status: 'DELIVERED' as const, count: 1156 },
  { status: 'CANCELLED' as const, count: 8 },
];

const mockTopSellingProducts = [
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
    sales: 156,
  },
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
    sales: 98,
  },
  {
    product: {
      id: '3',
      name: 'Wireless Headphones',
      sku: 'ELC-003',
      price: 199.99,
      category: 'Electronics',
      stockQuantity: 12,
      lowStockThreshold: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    sales: 67,
  },
];

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const dashboardData: DashboardData = {
        kpis: mockKPIData,
        recentOrders: [], // This will be populated by the orders slice
        revenueChart: mockRevenueChart,
        orderStatusDistribution: mockOrderStatusDistribution,
        topSellingProducts: mockTopSellingProducts,
      };

      return dashboardData;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchKPIData = createAsyncThunk(
  'dashboard/fetchKPIs',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockKPIData;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchRevenueChart = createAsyncThunk(
  'dashboard/fetchRevenueChart',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockRevenueChart;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchOrderStatusDistribution = createAsyncThunk(
  'dashboard/fetchOrderStatusDistribution',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockOrderStatusDistribution;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchTopSellingProducts = createAsyncThunk(
  'dashboard/fetchTopSellingProducts',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTopSellingProducts;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

interface DashboardState {
  kpis: KPIData | null;
  revenueChart: ChartData[];
  orderStatusDistribution: { status: string; count: number }[];
  topSellingProducts: { product: Product; sales: number }[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  kpis: null,
  revenueChart: [],
  orderStatusDistribution: [],
  topSellingProducts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateKPIs: (state, action: PayloadAction<Partial<KPIData>>) => {
      if (state.kpis) {
        state.kpis = { ...state.kpis, ...action.payload };
      }
    },
    setLastUpdated: (state, action: PayloadAction<string>) => {
      state.lastUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpis = action.payload.kpis;
        state.revenueChart = action.payload.revenueChart;
        state.orderStatusDistribution = action.payload.orderStatusDistribution;
        state.topSellingProducts = action.payload.topSellingProducts;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch KPIs
    builder
      .addCase(fetchKPIData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKPIData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpis = action.payload;
        state.error = null;
      })
      .addCase(fetchKPIData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Revenue Chart
    builder
      .addCase(fetchRevenueChart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueChart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueChart = action.payload;
        state.error = null;
      })
      .addCase(fetchRevenueChart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Order Status Distribution
    builder
      .addCase(fetchOrderStatusDistribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatusDistribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderStatusDistribution = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderStatusDistribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Top Selling Products
    builder
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topSellingProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateKPIs, setLastUpdated } = dashboardSlice.actions;
export default dashboardSlice.reducer;
