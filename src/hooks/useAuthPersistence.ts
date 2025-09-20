import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { initializeAuthFromStorage } from '@/store/slices/authSlice';
import { storageService } from '@/shared/services/storage';

export const useAuthPersistence = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Initialize auth from storage on mount
  useEffect(() => {
    dispatch(initializeAuthFromStorage());
  }, [dispatch]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Check if user has persistent auth data
  const hasPersistentAuth = storageService.hasAuthData();
  const isUserRemembered = storageService.isUserRemembered();

  return {
    isAuthenticated,
    user,
    hasPersistentAuth,
    isUserRemembered,
  };
};
