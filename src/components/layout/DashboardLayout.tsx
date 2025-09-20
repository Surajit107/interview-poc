'use client';

import { useSelector, useDispatch } from 'react-redux';
import { Menu, Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { RootState, AppDispatch } from '@/store';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => dispatch(toggleSidebar())}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right side of top bar */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function getPageTitle(): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/inventory':
        return 'Inventory Management';
      case '/orders':
        return 'Orders';
      case '/deliveries':
        return 'Delivery Management';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  }
  return 'Dashboard';
}