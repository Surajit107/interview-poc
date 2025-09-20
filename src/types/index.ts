// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessCategory?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessCategory?: string;
  profileImage?: File;
  termsAccepted: boolean;
}

// Product and Inventory Types
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

// Order and Delivery Types
export interface OrderItem {
  product: Product;
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
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  currentOrders: number;
}

// Dashboard and Analytics Types
export interface KPIData {
  totalOrders: { value: number; change: string };
  monthlyIncome: { value: number; change: string };
  activeProducts: { value: number; change: string };
  pendingDeliveries: { value: number; change: string };
}

export interface ChartData {
  month: string;
  revenue: number;
}

export interface DashboardData {
  kpis: KPIData;
  recentOrders: Order[];
  revenueChart: ChartData[];
  orderStatusDistribution: { status: OrderStatus; count: number }[];
  topSellingProducts: { product: Product; sales: number }[];
}

// Form and UI Types
export interface FormError {
  field: string;
  message: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FormError[];
}

// Business Categories
export const BUSINESS_CATEGORIES = [
  'Electronics & Gadgets',
  'Fashion & Apparel',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Recreation'
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number];

// File Upload Types
export interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  progress: number;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  stockMin?: number;
  stockMax?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}