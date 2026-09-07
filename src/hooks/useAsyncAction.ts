"use client";

import { useState, useCallback, useRef } from "react";

export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const run = useCallback(
    async (...args: Args): Promise<Result> => {
      setIsLoading(true);
      try {
        const result = await action(...args);
        return result;
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [action],
  );

  return { run, isLoading };
}
