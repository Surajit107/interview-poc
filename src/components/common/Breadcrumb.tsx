'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  
  const generateBreadcrumbs = () => {
    if (!pathname) return [];
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    let currentPath = '';
    
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      const segment = segments[i];
      
      // Format the segment name
      let name = segment;
      if (segment === 'inventory') name = 'Inventory';
      if (segment === 'add') name = 'Add Product';
      if (segment === 'edit') name = 'Edit Product';
      if (segment === 'dashboard') name = 'Dashboard';
      if (segment === 'orders') name = 'Orders';
      if (segment === 'deliveries') name = 'Deliveries';
      if (segment === 'settings') name = 'Settings';
      
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: i === segments.length - 1
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (breadcrumbs.length === 0) return null;
  
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}>
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          {breadcrumb.isLast ? (
            <span className="text-gray-900 font-medium">{breadcrumb.name}</span>
          ) : (
            <Link 
              href={breadcrumb.path}
              className="hover:text-gray-700 transition-colors"
            >
              {breadcrumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
