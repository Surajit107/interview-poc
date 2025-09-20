'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MicroLoading } from '@/components/ui/micro-loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <MicroLoading size="lg" />
    </div>
  );
}
