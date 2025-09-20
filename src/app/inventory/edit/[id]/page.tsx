'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { UpdateProductForm } from '@/features/inventory';
import { Product, ProductInput } from '@/features/inventory/types';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Mock product data for demo
const mockProduct: Product = {
  id: '1',
  name: 'Sample Product',
  sku: 'SAMPLE-001',
  description: 'This is a sample product for demonstration purposes. It showcases all the features of the update form.',
  price: 99.99,
  category: 'Electronics',
  imageUrl: 'https://via.placeholder.com/300x200?text=Sample+Product',
  stockQuantity: 50,
  lowStockThreshold: 10,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching product data
    const fetchProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProduct(mockProduct);
    };
    
    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Updated product data:', data);
      toast.success('Product updated successfully!');
      
      // In a real app, you would navigate to the product list or product detail page
      // router.push('/inventory');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/inventory');
  };

  const handleDuplicate = async (productId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Product duplicated successfully!');
    } catch (error) {
      toast.error('Failed to duplicate product.');
    }
  };

  const handleRestore = async (productId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Product restored successfully!');
    } catch (error) {
      toast.error('Failed to restore product.');
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Breadcrumb className="mb-4" />
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/inventory')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-4" />
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/inventory')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Product</h1>
        <p className="text-gray-600 mt-2">
          Update product details and configuration
        </p>
      </div>
      
      <UpdateProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDuplicate={handleDuplicate}
        onRestore={handleRestore}
        isLoading={isLoading}
      />
    </div>
  );
}
