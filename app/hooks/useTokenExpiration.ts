import { useEffect, useState } from 'react';
import { isTokenExpired, getTokenRemainingTime, handleLogout } from '../lib/auth/tokenManager';

/**
 * Hook to monitor token expiration and handle auto logout
 * @param checkInterval - Interval in milliseconds to check token expiration (default: 60 seconds)
 */
export const useTokenExpiration = (checkInterval = 60000): void => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    // Set initial remaining time after component mounts to avoid hydration issues
    setRemainingTime(getTokenRemainingTime());
    
    // Initial check
    if (isTokenExpired()) {
      console.log('Token already expired on initial check');
      handleLogout();
      return;
    }

    // Set up interval to check token expiration
    const intervalId = setInterval(() => {
      const newRemainingTime = getTokenRemainingTime();
      setRemainingTime(newRemainingTime);
      
      if (newRemainingTime <= 0) {
        console.log('Token expired during interval check');
        handleLogout();
      }
    }, checkInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [checkInterval]);
};
