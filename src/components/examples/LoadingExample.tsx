'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { MicroLoading } from '@/components/ui/micro-loading';
import { InlineLoading } from '@/components/ui/inline-loading';

export function LoadingExample() {
  const { showGlobalLoading, hideGlobalLoading, withLoading } = useGlobalLoading();

  const handleGlobalLoading = () => {
    showGlobalLoading();
    setTimeout(() => {
      hideGlobalLoading();
    }, 3000);
  };

  const handleAsyncOperation = async () => {
    await withLoading(async () => {
      // Simulate an async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Async operation completed!');
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Loading Components Demo</CardTitle>
        <CardDescription>
          Examples of different loading states and components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Micro Loading Sizes:</h4>
          <div className="flex items-center gap-4">
            <MicroLoading size="sm" />
            <MicroLoading size="md" />
            <MicroLoading size="lg" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Inline Loading:</h4>
          <InlineLoading text="Processing..." size="sm" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Global Loading:</h4>
          <div className="flex gap-2">
            <Button onClick={handleGlobalLoading} variant="outline" size="sm">
              Show Global Loading
            </Button>
            <Button onClick={handleAsyncOperation} variant="outline" size="sm">
              Async with Loading
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
