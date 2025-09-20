import { takeEvery, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  updateOrderStatus, 
  assignDeliveryAgent 
} from '../slices/orderSlice';
import { addNotification } from '../slices/uiSlice';
import { SUCCESS_MESSAGES } from '@/constants';

// Saga for handling order status update success
function* handleOrderStatusUpdated() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Order Updated',
      message: SUCCESS_MESSAGES.ORDER_UPDATED,
    }));
  } catch (error) {
    console.error('Error handling order status update success:', error);
  }
}

// Saga for handling delivery assignment success
function* handleDeliveryAssigned() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Delivery Assigned',
      message: SUCCESS_MESSAGES.DELIVERY_ASSIGNED,
    }));
  } catch (error) {
    console.error('Error handling delivery assignment success:', error);
  }
}

// Saga for handling order errors
function* handleOrderError(action: PayloadAction<string>) {
  try {
    yield put(addNotification({
      type: 'error',
      title: 'Order Error',
      message: action.payload,
    }));
  } catch (error) {
    console.error('Error handling order error:', error);
  }
}

// Watcher sagas
export function* watchOrderSagas() {
  // Success handlers
  yield takeEvery(updateOrderStatus.fulfilled.type, handleOrderStatusUpdated);
  yield takeEvery(assignDeliveryAgent.fulfilled.type, handleDeliveryAssigned);
  
  // Error handlers
  yield takeEvery(updateOrderStatus.rejected.type, handleOrderError);
  yield takeEvery(assignDeliveryAgent.rejected.type, handleOrderError);
}
