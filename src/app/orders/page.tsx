'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';

export default function OrdersPageRoute() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <OrdersPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
