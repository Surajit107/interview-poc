'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderFilters as OrderFiltersType } from '../types';

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFiltersChange: (filters: Partial<OrderFiltersType>) => void;
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ search: value });
  };

  const handleStatusFilter = (status: string) => {
    onFiltersChange({ status: status === 'all' ? '' : status });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters & Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PREPARING">Preparing</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="justify-start">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
