'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
  variant?: 'default' | 'destructive';
}

export function ErrorMessage({
  title = 'Error',
  message,
  onDismiss,
  className,
  variant = 'destructive',
}: ErrorMessageProps) {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div
      className={cn(
        'border rounded-md p-4',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
