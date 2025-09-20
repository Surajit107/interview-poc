'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MicroLoading } from '@/components/ui/micro-loading';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showGlobalLoading: () => void;
  hideGlobalLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    console.log('LoadingContext: setLoading called with:', loading);
    setIsLoading(loading);
  };

  const showGlobalLoading = () => {
    console.log('LoadingContext: showGlobalLoading called');
    setIsLoading(true);
  };

  const hideGlobalLoading = () => {
    console.log('LoadingContext: hideGlobalLoading called');
    setIsLoading(false);
  };

  // Debug log when isLoading changes
  React.useEffect(() => {
    console.log('LoadingContext: isLoading state changed to:', isLoading);
  }, [isLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        showGlobalLoading,
        hideGlobalLoading,
      }}
    >
      {children}
      {/* Temporarily disabled global loading overlay to debug issue */}
      {false && isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <MicroLoading size="md" />
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
