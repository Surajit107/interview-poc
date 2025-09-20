'use client';

import { useState } from 'react';
import { AddProductForm } from '@/features/inventory';
import { ProductInput } from '@/features/inventory/types';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Product data:', data);
      toast.success('Product created successfully!');
      
      // In a real app, you would navigate to the product list or product detail page
      // router.push('/inventory');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/inventory');
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Create a new product with comprehensive details and advanced features
        </p>
      </div>
      
      <AddProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
