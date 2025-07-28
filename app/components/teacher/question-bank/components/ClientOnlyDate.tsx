'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/app/lib/utils/dateUtils';

/**
 * Helper component for displaying dates that only renders on the client
 * to avoid hydration mismatch with server rendering
 */
const ClientOnlyDate = ({ 
  dateString, 
  locale = 'en-US',
  showTime = false 
}: { 
  dateString: string;
  locale?: string;
  showTime?: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return <span>Loading...</span>;
  
  try {
    const date = new Date(dateString);
    if (showTime) {
      return <span>{date.toLocaleString(locale)}</span>;
    }
    return <span>{formatDate(dateString, locale)}</span>;
  } catch (error) {
    return <span>Invalid Date</span>;
  }
};

export default ClientOnlyDate;
