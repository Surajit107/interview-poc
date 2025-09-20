'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { initializeAuthFromStorage } from '@/store/slices/authSlice';
import { storageService } from '@/shared/services/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth from storage on mount
    dispatch(initializeAuthFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Check if there's any auth data in storage before redirecting
      const hasAuthData = storageService.hasAuthData();
      if (!hasAuthData) {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
