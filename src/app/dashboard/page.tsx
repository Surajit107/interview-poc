'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Truck,
  Plus,
  Eye,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import { fetchOrders } from '@/store/slices/orderSlice';
import { RootState, AppDispatch } from '@/store';
import { ORDER_STATUS_COLORS } from '@/constants';
import { format } from 'date-fns';
import { ChartData, Order, Product } from '@/types';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { kpis, revenueChart, orderStatusDistribution, topSellingProducts } = useSelector((state: RootState) => state.dashboard);
  const { orders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchOrders({ page: 1, limit: 5 }));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-blue-100">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis?.totalOrders.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{kpis?.totalOrders.change}</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${kpis?.monthlyIncome.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{kpis?.monthlyIncome.change}</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis?.activeProducts.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">{kpis?.activeProducts.change}</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis?.pendingDeliveries.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{kpis?.pendingDeliveries.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue chart will be implemented with recharts</p>
                    <div className="mt-4 space-y-2">
                      {revenueChart.map((item: ChartData, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.month}</span>
                          <span className="font-medium">${item.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current order status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatusDistribution.map((item: { status: string; count: number }, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your customers</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Orders
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Truck className="mr-2 h-4 w-4" />
                  Manage Deliveries
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View Customers
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts.map((item: { product: Product; sales: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.sales} sales</p>
                      <p className="text-sm text-gray-600">${item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
