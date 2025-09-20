'use client';

import { 
  Eye, 
  Truck, 
  MoreHorizontal, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Order, OrderStatus } from '../types';
import { ORDER_STATUS_COLORS } from '@/constants';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
  filters: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onSort: (sortBy: string) => void;
  onPageChange: (page: number) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrdersTable({
  orders,
  isLoading,
  pagination,
  filters,
  onSort,
  onPageChange,
  onStatusUpdate,
}: OrdersTableProps) {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'CONFIRMED':
      case 'PREPARING':
        return <CheckCircle className="h-4 w-4" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck className="h-4 w-4" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    return ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (sortBy: string) => {
    onSort(sortBy);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({pagination.total})</CardTitle>
        <CardDescription>
          Showing {orders.length} of {pagination.total} orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                  Order ID
                  {filters.sortBy === 'id' && (
                    <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('customerName')}>
                  Customer
                  {filters.sortBy === 'customerName' && (
                    <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('total')}>
                  Total
                  {filters.sortBy === 'total' && (
                    <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Agent</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                  Date
                  {filters.sortBy === 'createdAt' && (
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
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {order.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{order.items.length} item(s)</p>
                        <p className="text-gray-500">
                          {order.items.map((item) => item.product.name).join(', ')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{order.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.deliveryAgent ? (
                        <span className="text-sm">{order.deliveryAgent}</span>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {order.status === 'PENDING' && (
                            <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'CONFIRMED')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm Order
                            </DropdownMenuItem>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'PREPARING')}>
                              <Clock className="mr-2 h-4 w-4" />
                              Start Preparing
                            </DropdownMenuItem>
                          )}
                          {order.status === 'PREPARING' && (
                            <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'OUT_FOR_DELIVERY')}>
                              <Truck className="mr-2 h-4 w-4" />
                              Out for Delivery
                            </DropdownMenuItem>
                          )}
                          {order.status === 'OUT_FOR_DELIVERY' && (
                            <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'DELIVERED')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Delivered
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
