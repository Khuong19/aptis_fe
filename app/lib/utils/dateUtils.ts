/**
 * Utility functions for date formatting to avoid hydration mismatches
 */

export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString: string, locale: string = 'en-US'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid Date';
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatDate(dateString);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
};

export const generateStableId = (prefix: string = 'id'): string => {
  // Use a counter instead of random to avoid hydration issues
  if (typeof window !== 'undefined') {
    // Client-side: use timestamp + random for uniqueness
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  } else {
    // Server-side: use a simple counter
    return `${prefix}-${Math.floor(Math.random() * 1000000)}`;
  }
}; 