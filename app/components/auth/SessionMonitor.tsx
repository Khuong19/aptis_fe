import React from 'react';
import { useTokenExpiration } from '@/app/hooks/useTokenExpiration';
import ClientOnly from '@/app/components/ui/ClientOnly';

/**
 * Component to monitor user session and handle auto logout
 * This is a "silent" component that should be included in protected layouts
 */
function SessionMonitorContent() {
  // Check token expiration every 30 seconds
  useTokenExpiration(30000);
  
  // This component doesn't render anything visible
  return null;
}

export default function SessionMonitor() {
  return (
    <ClientOnly>
      <SessionMonitorContent />
    </ClientOnly>
  );
}
