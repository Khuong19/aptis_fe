'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Generic component that only renders its children on the client side
 * to avoid hydration mismatches
 */
const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return <>{fallback}</>;
  
  return <>{children}</>;
};

export default ClientOnly; 