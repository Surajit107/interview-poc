'use client';

import { useEffect, useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderStatsComponent, OrderFiltersComponent, OrdersTable } from '../components';
import { OrderStatus, Order } from '../types';

export function OrdersPage() {
  const {
    orders,
    isLoading,
    error,
    pagination,
    filters,
    loadOrders,
    updateStatus,
    updateFilters,
    updatePagination,
    clearOrderError,
  } = useOrders();

  // Calculate order statistics
  const orderStats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === 'PENDING').length,
    confirmed: orders.filter((o: Order) => o.status === 'CONFIRMED').length,
    preparing: orders.filter((o: Order) => o.status === 'PREPARING').length,
    outForDelivery: orders.filter((o: Order) => o.status === 'OUT_FOR_DELIVERY').length,
    delivered: orders.filter((o: Order) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o: Order) => o.status === 'CANCELLED').length,
  }), [orders]);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (sortBy: string) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortBy, sortOrder });
    loadOrders({ sortBy, sortOrder });
  };

  const handlePageChange = (page: number) => {
    updatePagination({ page });
    loadOrders({ page });
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
      </div>

      {/* Order Stats */}
      <OrderStatsComponent stats={orderStats} />

      {/* Filters and Search */}
      <OrderFiltersComponent
        filters={filters}
        onFiltersChange={(newFilters) => {
          updateFilters(newFilters);
          loadOrders(newFilters);
        }}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        pagination={pagination}
        filters={filters}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearOrderError}
                  className="bg-red-100 px-2 py-1 rounded text-sm text-red-800 hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
