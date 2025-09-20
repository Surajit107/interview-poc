# Inventory Management Feature

This feature provides comprehensive product management capabilities with advanced forms for adding and updating products.

## Components

### AddProductForm

A multi-step form component for creating new products with comprehensive validation and advanced features.

#### Features

- **Multi-step Wizard**: 4-step process for better UX
- **Comprehensive Validation**: Zod schema validation with custom rules
- **File Upload**: Drag & drop image upload with progress tracking
- **Tag Management**: Dynamic tag addition/removal
- **Advanced Fields**: SEO, dimensions, digital products, supplier info
- **Real-time Validation**: Form validation on change
- **Progress Tracking**: Visual progress indicator

#### Usage

```tsx
import { AddProductForm } from '@/features/inventory';
import { ProductInput } from '@/features/inventory/types';

const handleSubmit = async (data: ProductInput) => {
  // Handle product creation
  console.log(data);
};

<AddProductForm
  onSubmit={handleSubmit}
  onCancel={() => router.back()}
  isLoading={false}
/>
```

#### Form Steps

1. **Basic Info**: Name, SKU, category, brand, description
2. **Pricing & Stock**: Price, cost price, stock quantities, sale settings
3. **Media & Tags**: Image upload, tags, image URLs
4. **Advanced**: Dimensions, digital products, SEO, supplier info

#### Validation Rules

- **Name**: 2-100 characters, alphanumeric with spaces/hyphens/underscores
- **SKU**: 3-20 characters, uppercase letters, numbers, hyphens only
- **Price**: Positive number, $0.01-$999,999.99
- **Stock**: Non-negative integers, max 999,999
- **Sale Price**: Must be less than regular price
- **Sale Dates**: End date must be after start date
- **Low Stock Threshold**: Must be less than current stock

### UpdateProductForm

A tabbed form component for updating existing products with change tracking and advanced features.

#### Features

- **Tabbed Interface**: Organized sections for better navigation
- **Change Tracking**: Visual indicators for unsaved changes
- **Product Summary**: Current product stats display
- **Duplicate/Restore**: Additional product management actions
- **Reset Functionality**: Reset form to original values
- **Comprehensive Fields**: All product attributes editable

#### Usage

```tsx
import { UpdateProductForm } from '@/features/inventory';
import { Product, ProductInput } from '@/features/inventory/types';

const product: Product = {
  // Product data
};

const handleSubmit = async (data: ProductInput) => {
  // Handle product update
  console.log(data);
};

<UpdateProductForm
  product={product}
  onSubmit={handleSubmit}
  onCancel={() => router.back()}
  onDuplicate={(id) => handleDuplicate(id)}
  onRestore={(id) => handleRestore(id)}
  isLoading={false}
/>
```

#### Form Tabs

1. **Basic Info**: Name, SKU, category, brand, description, status flags
2. **Pricing & Stock**: Price, cost price, stock quantities, sale settings
3. **Media & Tags**: Image upload, tags, image URLs
4. **Advanced**: Dimensions, digital products, SEO information

## Types

### Product

```tsx
interface Product {
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
```

### ProductInput

```tsx
interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
}
```

## Advanced Features

### File Upload

- **Supported Formats**: JPG, PNG, GIF
- **Max File Size**: 5MB per file
- **Max Files**: 5 images per product
- **Drag & Drop**: Intuitive file upload interface
- **Progress Tracking**: Visual upload progress
- **Preview**: Image preview with remove functionality

### Tag Management

- **Dynamic Tags**: Add/remove tags on the fly
- **Max Tags**: 10 tags per product
- **Validation**: No duplicate tags
- **Visual Feedback**: Tag badges with remove buttons

### Digital Products

- **Digital Flag**: Toggle for digital products
- **Download URL**: URL for digital product download
- **File Size**: File size in MB
- **Conditional Fields**: Show/hide based on digital flag

### SEO Fields

- **Meta Title**: SEO optimized title (max 60 chars)
- **Meta Description**: SEO description (max 160 chars)
- **Meta Keywords**: SEO keywords (max 200 chars)

### Supplier Information

- **Supplier Name**: Supplier company name
- **Supplier Email**: Contact email
- **Supplier Phone**: Contact phone number

### Tax & Compliance

- **Tax Rate**: Percentage tax rate (0-100%)
- **Taxable Flag**: Whether product is taxable
- **Barcode**: Product barcode
- **UPC**: Universal Product Code (13 digits)
- **EAN**: European Article Number (13 digits)

## Validation Schema

The forms use comprehensive Zod validation schemas with:

- **Type Safety**: Full TypeScript support
- **Custom Rules**: Business logic validation
- **Cross-field Validation**: Relationships between fields
- **Error Messages**: User-friendly error descriptions
- **Real-time Validation**: Immediate feedback

### Custom Validation Rules

```tsx
// Sale price must be less than regular price
.refine((data) => {
  if (data.salePrice && data.price && data.salePrice >= data.price) {
    return false;
  }
  return true;
}, {
  message: 'Sale price must be less than regular price',
  path: ['salePrice'],
})

// Sale dates must be valid
.refine((data) => {
  if (data.saleStartDate && data.saleEndDate) {
    const startDate = new Date(data.saleStartDate);
    const endDate = new Date(data.saleEndDate);
    return endDate > startDate;
  }
  return true;
}, {
  message: 'Sale end date must be after start date',
  path: ['saleEndDate'],
})
```

## Demo Pages

### Add Product Page

Visit `/inventory/add` to see the AddProductForm in action.

### Edit Product Page

Visit `/inventory/edit/[id]` to see the UpdateProductForm in action.

## Integration

### With Redux Store

```tsx
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '@/store/slices/inventorySlice';

const dispatch = useDispatch();

const handleSubmit = async (data: ProductInput) => {
  const result = await dispatch(createProduct(data));
  if (createProduct.fulfilled.match(result)) {
    toast.success('Product created successfully!');
  }
};
```

### With API

```tsx
const handleSubmit = async (data: ProductInput) => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      toast.success('Product created successfully!');
    }
  } catch (error) {
    toast.error('Failed to create product');
  }
};
```

## Styling

The components use Tailwind CSS and shadcn/ui components for consistent styling:

- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Mode**: Compatible with theme switching
- **Loading States**: Visual feedback during operations
- **Error States**: Clear error indication

## Performance

- **Lazy Loading**: Components load only when needed
- **Memoization**: Optimized re-renders
- **Form Optimization**: Efficient form state management
- **File Handling**: Optimized file upload and preview

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces
2. **Validation**: Comprehensive client-side validation
3. **Error Handling**: Graceful error handling and user feedback
4. **Accessibility**: Follow WCAG guidelines
5. **Performance**: Optimize for large datasets
6. **Security**: Validate all user inputs
7. **UX**: Provide clear feedback and loading states
