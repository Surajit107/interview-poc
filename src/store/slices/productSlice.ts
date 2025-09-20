import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductInput, PaginatedResponse, PaginationParams } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    sku: 'COF-001',
    description: 'High-quality arabica coffee beans',
    price: 24.99,
    category: 'Beverages',
    imageUrl: 'https://via.placeholder.com/300x300?text=Coffee',
    stockQuantity: 45,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Organic Green Tea',
    sku: 'TEA-002',
    description: 'Premium organic green tea leaves',
    price: 18.50,
    category: 'Beverages',
    imageUrl: 'https://via.placeholder.com/300x300?text=Tea',
    stockQuantity: 5,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    sku: 'ELC-003',
    description: 'Noise-cancelling wireless headphones',
    price: 199.99,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
    stockQuantity: 12,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredProducts = [...mockProducts];

      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.sku.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (params.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === params.category
        );
      }

      // Apply status filter
      if (params.status) {
        const isActive = params.status === 'active';
        filteredProducts = filteredProducts.filter(
          product => product.isActive === isActive
        );
      }

      // Apply price range filter
      if (params.priceMin !== undefined || params.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.price;
          const minValid = params.priceMin === undefined || price >= params.priceMin;
          const maxValid = params.priceMax === undefined || price <= params.priceMax;
          return minValid && maxValid;
        });
      }

      // Apply stock range filter
      if (params.stockMin !== undefined || params.stockMax !== undefined) {
        filteredProducts = filteredProducts.filter(product => {
          const stock = product.stockQuantity;
          const minValid = params.stockMin === undefined || stock >= params.stockMin;
          const maxValid = params.stockMax === undefined || stock <= params.stockMax;
          return minValid && maxValid;
        });
      }

      // Apply sorting
      if (params.sortBy) {
        filteredProducts.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Product];
          const bValue = b[params.sortBy as keyof Product];

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
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      const response: PaginatedResponse<Product> = {
        data: paginatedProducts,
        total: filteredProducts.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(filteredProducts.length / params.limit),
      };

      return response;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: ProductInput, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newProduct: Product = {
        id: Date.now().toString(),
        sku: `PRD-${Date.now()}`,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockProducts.push(newProduct);

      return newProduct;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<ProductInput> }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return rejectWithValue('Product not found');
      }

      const updatedProduct = {
        ...mockProducts[productIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockProducts[productIndex] = updatedProduct;

      return updatedProduct;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return rejectWithValue('Product not found');
      }

      mockProducts.splice(productIndex, 1);

      return id;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return rejectWithValue('Product not found');
      }

      const updatedProduct = {
        ...mockProducts[productIndex],
        stockQuantity: quantity,
        updatedAt: new Date().toISOString(),
      };

      mockProducts[productIndex] = updatedProduct;

      return updatedProduct;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
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
    category: string;
    status: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    priceMin?: number;
    priceMax?: number;
    stockMin?: number;
    stockMax?: number;
  };
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
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
    category: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    priceMin: undefined,
    priceMax: undefined,
    stockMin: undefined,
    stockMax: undefined,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<ProductState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Stock
    builder
      .addCase(updateStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentProduct, setFilters, setPagination, resetFilters } = productSlice.actions;
export default productSlice.reducer;
