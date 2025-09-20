import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchOrders,
  updateOrderStatus,
  assignDeliveryAgent,
  fetchDeliveryAgents,
  setFilters,
  setPagination,
  resetFilters,
  clearError,
} from '../store/orderSlice';
import { OrderFilters, OrderPagination, UpdateOrderStatusPayload, AssignDeliveryAgentPayload } from '../types';

export const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderState = useSelector((state: RootState) => state.orders);

  const loadOrders = useCallback((params?: OrderFilters & OrderPagination) => {
    const currentParams = {
      page: orderState.pagination.page,
      limit: orderState.pagination.limit,
      search: orderState.filters.search,
      status: orderState.filters.status,
      sortBy: orderState.filters.sortBy,
      sortOrder: orderState.filters.sortOrder,
      ...params,
    };
    
    dispatch(fetchOrders(currentParams));
  }, [
    dispatch, 
    orderState.pagination.page, 
    orderState.pagination.limit,
    orderState.filters.search,
    orderState.filters.status,
    orderState.filters.sortBy,
    orderState.filters.sortOrder
  ]);

  const updateStatus = useCallback((payload: UpdateOrderStatusPayload) => {
    dispatch(updateOrderStatus(payload));
  }, [dispatch]);

  const assignAgent = useCallback((payload: AssignDeliveryAgentPayload) => {
    dispatch(assignDeliveryAgent(payload));
  }, [dispatch]);

  const loadDeliveryAgents = useCallback(() => {
    dispatch(fetchDeliveryAgents());
  }, [dispatch]);

  const updateFilters = useCallback((filters: Partial<OrderFilters>) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  const updatePagination = useCallback((pagination: Partial<OrderPagination>) => {
    dispatch(setPagination(pagination));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const clearOrderError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    orders: orderState.orders,
    currentOrder: orderState.currentOrder,
    deliveryAgents: orderState.deliveryAgents,
    isLoading: orderState.isLoading,
    error: orderState.error,
    pagination: orderState.pagination,
    filters: orderState.filters,
    
    // Actions
    loadOrders,
    updateStatus,
    assignAgent,
    loadDeliveryAgents,
    updateFilters,
    updatePagination,
    clearFilters,
    clearOrderError,
  };
};
