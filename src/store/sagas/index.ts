import { all, fork } from 'redux-saga/effects';
import { watchAuthSagas } from './authSaga';
import { watchProductSagas } from './productSaga';
import { watchOrderSagas } from './orderSaga';
import { watchDashboardSagas } from './dashboardSaga';

export default function* rootSaga() {
  yield all([
    fork(watchAuthSagas),
    fork(watchProductSagas),
    fork(watchOrderSagas),
    fork(watchDashboardSagas),
  ]);
}
