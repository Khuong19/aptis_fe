'use client';

import { useState, useEffect } from 'react';

/**
 * Helper component for displaying dates that only renders on the client
 * to avoid hydration mismatch with server rendering
 */
const ClientOnlyDate = ({ dateString }: { dateString: string }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return <span>Loading...</span>;
  
  return <span>{new Date(dateString).toLocaleDateString()}</span>;
};

export default ClientOnlyDate;