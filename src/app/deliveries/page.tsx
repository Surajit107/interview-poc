'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Truck,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchOrders, fetchDeliveryAgents, assignDeliveryAgent } from '@/store/slices/orderSlice';
import { RootState, AppDispatch } from '@/store';
import { ORDER_STATUS_COLORS } from '@/constants';
import { format } from 'date-fns';
import { DeliveryAgent, Order } from '@/types';

export default function DeliveriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, deliveryAgents } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 50 }));
    dispatch(fetchDeliveryAgents());
  }, [dispatch]);

  const handleAssignAgent = (orderId: string, agentId: string) => {
    dispatch(assignDeliveryAgent({ orderId, agentId }));
  };

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  };

  // Filter orders that need delivery assignment
  const ordersNeedingDelivery = orders.filter((order: { status: string; }) =>
    order.status === 'PREPARING' || order.status === 'CONFIRMED'
  );

  const ordersOutForDelivery = orders.filter((order: { status: string; }) =>
    order.status === 'OUT_FOR_DELIVERY'
  );

  const availableAgents = deliveryAgents.filter((agent: DeliveryAgent) => agent.isAvailable);

  const deliveryStats = {
    pendingAssignment: ordersNeedingDelivery.length,
    outForDelivery: ordersOutForDelivery.length,
    availableAgents: availableAgents.length,
    totalAgents: deliveryAgents.length,
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
              <p className="text-gray-600">Manage delivery assignments and track orders</p>
            </div>
          </div>

          {/* Delivery Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{deliveryStats.pendingAssignment}</p>
                    <p className="text-sm text-gray-600">Pending Assignment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{deliveryStats.outForDelivery}</p>
                    <p className="text-sm text-gray-600">Out for Delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{deliveryStats.availableAgents}</p>
                    <p className="text-sm text-gray-600">Available Agents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{deliveryStats.totalAgents}</p>
                    <p className="text-sm text-gray-600">Total Agents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Agents */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Agents</CardTitle>
              <CardDescription>Available delivery personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryAgents.map((agent: DeliveryAgent) => (
                  <div key={agent.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{agent.name}</span>
                      </div>
                      <Badge className={agent.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {agent.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{agent.phone}</p>
                    <p className="text-sm text-gray-500">
                      Current Orders: {agent.currentOrders}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders Needing Delivery Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Needing Delivery Assignment</CardTitle>
              <CardDescription>
                {ordersNeedingDelivery.length} orders ready for delivery assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ordersNeedingDelivery.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders need delivery assignment at the moment.
                  </div>
                ) : (
                  ordersNeedingDelivery.map((order: Order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {order.id}
                            </code>
                            <Badge className={getStatusColor(order.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{order.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-gray-600">{order.customerEmail}</p>
                            </div>
                            <div>
                              <p className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{order.deliveryAddress}</span>
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <p className="text-gray-600">
                                {order.items.length} item(s)
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Select onValueChange={(agentId) => handleAssignAgent(order.id, agentId)}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Assign Agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableAgents.map((agent: DeliveryAgent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name} ({agent.currentOrders} orders)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders Out for Delivery */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Out for Delivery</CardTitle>
              <CardDescription>
                {ordersOutForDelivery.length} orders currently being delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Estimated Delivery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersOutForDelivery.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No orders are currently out for delivery.
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordersOutForDelivery.map((order: Order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {order.id}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-gray-500">{order.customerPhone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{order.deliveryAddress}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{order.deliveryAgent}</span>
                          </TableCell>
                          <TableCell>
                            {order.estimatedDelivery ? (
                              <span className="text-sm">
                                {format(new Date(order.estimatedDelivery), 'MMM dd, HH:mm')}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Not set</span>
                            )}
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <MapPin className="mr-2 h-4 w-4" />
                                  View Route
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Failed Delivery
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
