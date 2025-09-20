import { takeEvery, call, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  loginUser,
  signupUser,
  verifyEmail,
  sendVerificationEmail,
  logoutUser
} from '../slices/authSlice';
import { addNotification } from '../slices/uiSlice';
import { STORAGE_KEYS } from '@/constants';
import { User, AuthResponse } from '@/types';
import { RootState } from '@/store';

// Helper function to save to localStorage
function* saveToStorage(key: string, value: unknown): Generator<unknown, void, unknown> {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Helper function to remove from localStorage
function* removeFromStorage(key: string): Generator<unknown, void, unknown> {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// Helper function to get from localStorage
function* getFromStorage(key: string): Generator<unknown, unknown, unknown> {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
}

// Saga for handling login success
function* handleLoginSuccess(action: PayloadAction<AuthResponse>): Generator<unknown, void, unknown> {
  try {
    const { user, token } = action.payload;

    // Save to localStorage if remember me is checked
    const rememberMe = yield select((state: RootState) => state.auth.rememberMe);
    if (rememberMe && user && token) {
      yield call(saveToStorage, STORAGE_KEYS.AUTH_TOKEN, token);
      yield call(saveToStorage, STORAGE_KEYS.USER_DATA, user);
    }

    // Show success notification
    if (user) {
      yield put(addNotification({
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${user.name}!`,
      }));
    }
  } catch (error) {
    console.error('Error handling login success:', error);
  }
}

// Saga for handling signup success
function* handleSignupSuccess(action: PayloadAction<AuthResponse>): Generator<unknown, void, unknown> {
  try {
    const { user } = action.payload;

    // Show success notification
    yield put(addNotification({
      type: 'success',
      title: 'Account Created',
      message: 'Your account has been created successfully. Please verify your email.',
    }));
  } catch (error) {
    console.error('Error handling signup success:', error);
  }
}

// Saga for handling email verification success
function* handleEmailVerificationSuccess(): Generator<unknown, void, unknown> {
  try {
    yield put(addNotification({
      type: 'success',
      title: 'Email Verified',
      message: 'Your email has been verified successfully!',
    }));
  } catch (error) {
    console.error('Error handling email verification success:', error);
  }
}

// Saga for handling verification email sent
function* handleVerificationEmailSent(): Generator<unknown, void, unknown> {
  try {
    yield put(addNotification({
      type: 'info',
      title: 'Verification Email Sent',
      message: 'Please check your email for the verification code.',
    }));
  } catch (error) {
    console.error('Error handling verification email sent:', error);
  }
}

// Saga for handling logout
function* handleLogout(): Generator<unknown, void, unknown> {
  try {
    // Clear localStorage
    yield call(removeFromStorage, STORAGE_KEYS.AUTH_TOKEN);
    yield call(removeFromStorage, STORAGE_KEYS.USER_DATA);

    // Show success notification
    yield put(addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out successfully.',
    }));
  } catch (error) {
    console.error('Error handling logout:', error);
  }
}

// Saga for handling auth errors
function* handleAuthError(action: PayloadAction<string>): Generator<unknown, void, unknown> {
  try {
    yield put(addNotification({
      type: 'error',
      title: 'Authentication Error',
      message: action.payload,
    }));
  } catch (error) {
    console.error('Error handling auth error:', error);
  }
}

// Watcher sagas
export function* watchAuthSagas(): Generator<unknown, void, unknown> {
  // Success handlers
  yield takeEvery(loginUser.fulfilled.type, handleLoginSuccess);
  yield takeEvery(signupUser.fulfilled.type, handleSignupSuccess);
  yield takeEvery(verifyEmail.fulfilled.type, handleEmailVerificationSuccess);
  yield takeEvery(sendVerificationEmail.fulfilled.type, handleVerificationEmailSent);
  yield takeEvery(logoutUser.fulfilled.type, handleLogout);

  // Error handlers
  yield takeEvery(loginUser.rejected.type, handleAuthError);
  yield takeEvery(signupUser.rejected.type, handleAuthError);
  yield takeEvery(verifyEmail.rejected.type, handleAuthError);
  yield takeEvery(sendVerificationEmail.rejected.type, handleAuthError);
  yield takeEvery(logoutUser.rejected.type, handleAuthError);
}
