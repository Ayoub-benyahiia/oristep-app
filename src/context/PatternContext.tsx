import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrigamiPattern } from '../types';
import { fetchPatterns } from '../services/patternService';
import { PATTERNS as LOCAL_PATTERNS } from '../data';

interface PatternContextType {
  patterns: OrigamiPattern[];
  isLoading: boolean;
  error: Error | null;
  refreshPatterns: () => Promise<void>;
  getPatternById: (id: string) => OrigamiPattern | undefined;
  getPatternBySlug: (slug: string) => OrigamiPattern | undefined;
}

const PatternContext = createContext<PatternContextType | undefined>(undefined);

export function PatternProvider({ children }: { children: React.ReactNode }) {
  const [patterns, setPatterns] = useState<OrigamiPattern[]>(LOCAL_PATTERNS); // Start with local to avoid flicker
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshPatterns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await fetchPatterns();
      setPatterns(fetched);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('Failed to load patterns'));
      // We don't overwrite patterns with empty on error, so they keep the LOCAL_PATTERNS fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPatterns();
  }, []);

  const getPatternById = (id: string) => patterns.find(p => p.id === id);
  const getPatternBySlug = (slug: string) => patterns.find(p => p.slug === slug);

  return (
    <PatternContext.Provider value={{ patterns, isLoading, error, refreshPatterns, getPatternById, getPatternBySlug }}>
      {children}
    </PatternContext.Provider>
  );
}

export function usePatterns() {
  const context = useContext(PatternContext);
  if (context === undefined) {
    throw new Error('usePatterns must be used within a PatternProvider');
  }
  return context;
}
