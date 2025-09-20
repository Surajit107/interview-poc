import { takeEvery, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchDashboardData,
  fetchKPIData,
  fetchRevenueChart,
  fetchOrderStatusDistribution,
  fetchTopSellingProducts
} from '../slices/dashboardSlice';
import { addNotification } from '../slices/uiSlice';

// Saga for handling dashboard data fetch success
function* handleDashboardDataFetched() {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Dashboard Updated',
      message: 'Dashboard data has been refreshed successfully.',
    }));
  } catch (error) {
    console.error('Error handling dashboard data fetch success:', error);
  }
}

// Saga for handling dashboard errors
function* handleDashboardError(action: PayloadAction<string>) {
  try {
    yield put(addNotification({
      type: 'error',
      title: 'Dashboard Error',
      message: action.payload,
    }));
  } catch (error) {
    console.error('Error handling dashboard error:', error);
  }
}

// Watcher sagas
export function* watchDashboardSagas() {
  // Success handlers
  yield takeEvery(fetchDashboardData.fulfilled.type, handleDashboardDataFetched);
  yield takeEvery(fetchKPIData.fulfilled.type, handleDashboardDataFetched);
  yield takeEvery(fetchRevenueChart.fulfilled.type, handleDashboardDataFetched);
  yield takeEvery(fetchOrderStatusDistribution.fulfilled.type, handleDashboardDataFetched);
  yield takeEvery(fetchTopSellingProducts.fulfilled.type, handleDashboardDataFetched);
  
  // Error handlers
  yield takeEvery(fetchDashboardData.rejected.type, handleDashboardError);
  yield takeEvery(fetchKPIData.rejected.type, handleDashboardError);
  yield takeEvery(fetchRevenueChart.rejected.type, handleDashboardError);
  yield takeEvery(fetchOrderStatusDistribution.rejected.type, handleDashboardError);
  yield takeEvery(fetchTopSellingProducts.rejected.type, handleDashboardError);
}
