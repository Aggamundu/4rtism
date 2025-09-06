import { useEffect } from 'react';

/**
 * Custom hook to prevent body scrolling when an overlay is open
 * @param isOpen - Boolean indicating if the overlay is open
 */
export const useScrollPrevention = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
};
