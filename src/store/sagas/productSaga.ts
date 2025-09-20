import { takeEvery, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateStock 
} from '../slices/productSlice';
import { addNotification } from '../slices/uiSlice';
import { SUCCESS_MESSAGES } from '@/constants';

// Saga for handling product creation success
function* handleProductCreated() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Product Created',
      message: SUCCESS_MESSAGES.PRODUCT_CREATED,
    }));
  } catch (error) {
    console.error('Error handling product creation success:', error);
  }
}

// Saga for handling product update success
function* handleProductUpdated() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Product Updated',
      message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
    }));
  } catch (error) {
    console.error('Error handling product update success:', error);
  }
}

// Saga for handling product deletion success
function* handleProductDeleted() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Product Deleted',
      message: SUCCESS_MESSAGES.PRODUCT_DELETED,
    }));
  } catch (error) {
    console.error('Error handling product deletion success:', error);
  }
}

// Saga for handling stock update success
function* handleStockUpdated() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Stock Updated',
      message: 'Product stock has been updated successfully.',
    }));
  } catch (error) {
    console.error('Error handling stock update success:', error);
  }
}

// Saga for handling product errors
function* handleProductError(action: PayloadAction<string>) {
  try {
    yield put(addNotification({
      type: 'error',
      title: 'Product Error',
      message: action.payload,
    }));
  } catch (error) {
    console.error('Error handling product error:', error);
  }
}

// Watcher sagas
export function* watchProductSagas() {
  // Success handlers
  yield takeEvery(createProduct.fulfilled.type, handleProductCreated);
  yield takeEvery(updateProduct.fulfilled.type, handleProductUpdated);
  yield takeEvery(deleteProduct.fulfilled.type, handleProductDeleted);
  yield takeEvery(updateStock.fulfilled.type, handleStockUpdated);
  
  // Error handlers
  yield takeEvery(createProduct.rejected.type, handleProductError);
  yield takeEvery(updateProduct.rejected.type, handleProductError);
  yield takeEvery(deleteProduct.rejected.type, handleProductError);
  yield takeEvery(updateStock.rejected.type, handleProductError);
}
