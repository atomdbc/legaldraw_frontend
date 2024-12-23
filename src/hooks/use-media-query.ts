"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    // Define callback
    function onChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    // Add listener
    mediaQuery.addEventListener("change", onChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [query]);

  // Prevent SSR mismatch by returning false until mounted
  if (!mounted) return false;

  return matches;
}