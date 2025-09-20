// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
}

// Inventory State Types
export interface InventoryState {
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
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

// Inventory Action Types
export interface InventoryFilters {
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryPagination {
  page?: number;
  limit?: number;
}

// Inventory Statistics
export interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
}
