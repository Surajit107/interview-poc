'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { fetchProducts, setFilters, setPagination, deleteProduct } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store';
import { PRODUCT_CATEGORIES, STOCK_THRESHOLDS } from '@/constants';
import { format } from 'date-fns';
import { Product } from '@/types';

export default function InventoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, isLoading, pagination, filters } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockRange, setStockRange] = useState({ min: '', max: '' });

  // Confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      category: filters.category,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      stockMin: filters.stockMin,
      stockMax: filters.stockMax,
    }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryFilter = (category: string) => {
    dispatch(setFilters({ category: category === 'all' ? '' : category }));
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status: status === 'all' ? '' : status }));
  };

  const handlePriceRangeFilter = () => {
    const min = priceRange.min ? parseFloat(priceRange.min) : undefined;
    const max = priceRange.max ? parseFloat(priceRange.max) : undefined;
    dispatch(setFilters({ priceMin: min, priceMax: max }));
  };

  const handleStockRangeFilter = () => {
    const min = stockRange.min ? parseInt(stockRange.min) : undefined;
    const max = stockRange.max ? parseInt(stockRange.max) : undefined;
    dispatch(setFilters({ stockMin: min, stockMax: max }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setStockRange({ min: '', max: '' });
    dispatch(setFilters({
      search: '',
      category: '',
      status: '',
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined
    }));
  };

  const handleSort = (sortBy: string) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy, sortOrder }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
  };

  const handlePageSizeChange = (limit: number) => {
    dispatch(setPagination({ page: 1, limit }));
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(productToDelete.id)).unwrap();
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProduct = () => {
    router.push('/inventory/add');
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/inventory/edit/${productId}`);
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= STOCK_THRESHOLDS.CRITICAL_STOCK) {
      return { status: 'critical', color: 'bg-red-100 text-red-800' };
    } else if (quantity <= threshold) {
      return { status: 'low', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'good', color: 'bg-green-100 text-green-800' };
  };

  const lowStockProducts = products.filter((p: Product) => p.stockQuantity <= p.lowStockThreshold);

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.category || filters.status ||
    filters.priceMin !== undefined || filters.priceMax !== undefined ||
    filters.stockMin !== undefined || filters.stockMax !== undefined;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600">Manage your product inventory and stock levels</p>
            </div>
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  {lowStockProducts.length} product(s) are running low on stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map((product: Product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          {product.stockQuantity} left
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        Restock
                      </Button>
                    </div>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <p className="text-sm text-yellow-700">
                      And {lowStockProducts.length - 3} more products...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filters & Search</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-red-600 hover:text-red-700 border-red-200"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Filters - Aligned side by side */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select
                    onValueChange={handleCategoryFilter}
                    value={filters.category || 'all'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={handleStatusFilter}
                    value={filters.status || 'all'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) => handlePageSizeChange(parseInt(value))}
                    value={pagination.limit.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`${pagination.limit} per page`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Price Range ($)</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Min"
                            type="number"
                            step="0.01"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Max"
                            type="number"
                            step="0.01"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={handlePriceRangeFilter}
                            variant="outline"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>

                      {/* Stock Range */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Stock Range</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Min"
                            type="number"
                            value={stockRange.min}
                            onChange={(e) => setStockRange(prev => ({ ...prev, min: e.target.value }))}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Max"
                            type="number"
                            value={stockRange.max}
                            onChange={(e) => setStockRange(prev => ({ ...prev, max: e.target.value }))}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={handleStockRangeFilter}
                            variant="outline"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.search && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Search: &quot;{filters.search}&quot;
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Category: {filters.category}
                    </Badge>
                  )}
                  {filters.status && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Status: {filters.status}
                    </Badge>
                  )}
                  {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Price: ${filters.priceMin || 0} - ${filters.priceMax || '∞'}
                    </Badge>
                  )}
                  {(filters.stockMin !== undefined || filters.stockMax !== undefined) && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Stock: {filters.stockMin || 0} - {filters.stockMax || '∞'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({pagination.total})</CardTitle>
              <CardDescription>
                Showing {products.length} of {pagination.total} products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                        Product
                        {filters.sortBy === 'name' && (
                          <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                        Category
                        {filters.sortBy === 'category' && (
                          <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                        Price
                        {filters.sortBy === 'price' && (
                          <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('stockQuantity')}>
                        Stock
                        {filters.sortBy === 'stockQuantity' && (
                          <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('updatedAt')}>
                        Last Updated
                        {filters.sortBy === 'updatedAt' && (
                          <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: Product) => {
                        const stockStatus = getStockStatus(product.stockQuantity, product.lowStockThreshold);
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-500">{product.description}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {product.sku}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${product.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{product.stockQuantity}</span>
                                <Badge className={stockStatus.color}>
                                  {stockStatus.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {format(new Date(product.updatedAt), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Update Stock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Enhanced Pagination - Always visible at bottom */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </p>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setProductToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Product"
            description={`Are you sure you want to delete ${productToDelete?.name || 'this product'}? This action cannot be undone.`}
            variant="danger"
            confirmText="Delete"
            isLoading={isDeleting}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
