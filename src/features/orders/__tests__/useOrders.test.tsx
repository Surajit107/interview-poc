import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useOrders } from '../hooks/useOrders';
import orderReducer from '../store/orderSlice';
import React from 'react';

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      orders: orderReducer,
    },
  });
};

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useOrders', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    expect(result.current.orders).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it('should load orders', async () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    await act(async () => {
      result.current.loadOrders();
    });

    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.orders).toHaveLength(2);
    expect(result.current.orders[0].id).toBe('ORD-001');
  });

  it('should update filters', () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    act(() => {
      result.current.updateFilters({ search: 'test' });
    });

    expect(result.current.filters.search).toBe('test');
  });

  it('should update pagination', () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    act(() => {
      result.current.updatePagination({ page: 2 });
    });

    expect(result.current.pagination.page).toBe(2);
  });

  it('should clear filters', () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    // First set some filters
    act(() => {
      result.current.updateFilters({ search: 'test', status: 'PENDING' });
    });

    expect(result.current.filters.search).toBe('test');
    expect(result.current.filters.status).toBe('PENDING');

    // Then clear them
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.status).toBe('');
  });
});
