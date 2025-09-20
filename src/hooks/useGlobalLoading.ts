import { useLoading } from '@/contexts/LoadingContext';

export function useGlobalLoading() {
  const { isLoading, setLoading, showGlobalLoading, hideGlobalLoading } = useLoading();

  const withLoading = async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      showGlobalLoading();
      const result = await asyncFn();
      return result;
    } finally {
      hideGlobalLoading();
    }
  };

  return {
    isLoading,
    setLoading,
    showGlobalLoading,
    hideGlobalLoading,
    withLoading,
  };
}
