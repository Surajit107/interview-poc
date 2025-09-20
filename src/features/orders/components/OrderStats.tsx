'use client';

import { Card, CardContent } from '@/components/ui/card';
import { OrderStats as OrderStatsType } from '../types';

interface OrderStatsProps {
  stats: OrderStatsType;
}

export function OrderStats({ stats }: OrderStatsProps) {
  const statItems = [
    { label: 'Total', value: stats.total, color: 'text-gray-900' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
    { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600' },
    { label: 'Preparing', value: stats.preparing, color: 'text-orange-600' },
    { label: 'Out for Delivery', value: stats.outForDelivery, color: 'text-purple-600' },
    { label: 'Delivered', value: stats.delivered, color: 'text-green-600' },
    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
              <p className="text-sm text-gray-600">
                {item.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
