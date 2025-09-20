// Authentication Constants
export const AUTH_CONSTANTS = {
  MOCK_CREDENTIALS: {
    email: 'retailer@example.com',
    password: 'RetailerPass123'
  },
  MOCK_OTP: '123456',
  TOKEN_KEY: 'retailer_auth_token',
  USER_KEY: 'retailer_user_data',
  REMEMBER_ME_KEY: 'retailer_remember_me'
} as const;

// API Constants
export const API_ENDPOINTS = {
  GRAPHQL: '/api/graphql',
  UPLOAD: '/api/upload'
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif']
} as const;

// Business Categories
export const BUSINESS_CATEGORIES = [
  'Electronics & Gadgets',
  'Fashion & Apparel',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Recreation'
] as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports',
  'Books',
  'Toys',
  'Automotive',
  'Other'
] as const;

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
} as const;

// Stock Thresholds
export const STOCK_THRESHOLDS = {
  LOW_STOCK: 5,
  CRITICAL_STOCK: 2
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication Errors
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  INVALID_OTP: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP expired. Please request a new one.',
  
  // Business Details Errors
  BUSINESS_NAME_REQUIRED: 'Business name is required',
  INVALID_IMAGE_FILE: 'Please upload a valid image file',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  TERMS_NOT_ACCEPTED: 'Please accept terms and conditions',
  
  // General Errors
  NETWORK_ERROR: 'Network error. Please try again.',
  SOMETHING_WRONG: 'Something went wrong. Please refresh the page.',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  
  // Product Errors
  PRODUCT_NAME_REQUIRED: 'Product name is required',
  INVALID_PRICE: 'Price must be a positive number',
  INVALID_STOCK: 'Stock quantity must be a non-negative number',
  
  // Order Errors
  ORDER_NOT_FOUND: 'Order not found',
  INVALID_ORDER_STATUS: 'Invalid order status',
  DELIVERY_AGENT_UNAVAILABLE: 'Delivery agent is not available'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  EMAIL_SENT: 'Verification email sent successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_UPDATED: 'Order updated successfully',
  DELIVERY_ASSIGNED: 'Delivery assigned successfully'
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SKU_PATTERN: /^[A-Z0-9-]+$/
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316'  // Orange
] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'retailer_auth_token',
  USER_DATA: 'retailer_user_data',
  REMEMBER_ME: 'retailer_remember_me',
  THEME: 'retailer_theme',
  LANGUAGE: 'retailer_language'
} as const;
