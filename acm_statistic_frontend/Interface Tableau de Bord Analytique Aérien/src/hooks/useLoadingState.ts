import { useState, useEffect } from 'react';

interface UseLoadingStateOptions {
  initialDelay?: number;
  minLoadingTime?: number;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const { initialDelay = 0, minLoadingTime = 800 } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    // Initial delay before starting
    const initialTimer = setTimeout(() => {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const elapsed = Date.now() - startTime - initialDelay;
          const progressValue = Math.min((elapsed / minLoadingTime) * 100, 95);
          
          if (progressValue >= 95) {
            clearInterval(progressInterval);
          }
          
          return progressValue;
        });
      }, 50);

      // Finish loading after minimum time
      const finishTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 200); // Small delay for smooth transition
      }, minLoadingTime);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(finishTimer);
      };
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
    };
  }, [initialDelay, minLoadingTime]);

  return { isLoading, progress };
}

// Hook for simulating data fetching
export function useDataLoading<T>(
  dataFetcher: () => T,
  dependencies: any[] = [],
  loadingTime = 1000
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setData(null);

    const timer = setTimeout(() => {
      const result = dataFetcher();
      setData(result);
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, dependencies);

  return { data, isLoading };
}