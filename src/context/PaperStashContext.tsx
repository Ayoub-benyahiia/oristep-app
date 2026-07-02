import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Paper } from '../types';

interface PaperStashContextState {
  papers: Paper[];
  addPaper: (paper: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePaper: (id: string, updates: Partial<Paper>) => void;
  deletePaper: (id: string) => void;
  resetPaperStash: () => void;
}

const PaperStashContext = createContext<PaperStashContextState | undefined>(undefined);

const createPaperId = () =>
  globalThis.crypto?.randomUUID?.() ?? `paper-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function PaperStashProvider({ children }: { children: ReactNode }) {
  const [papers, setPapers] = useState<Paper[]>(() => {
    try {
      const saved = localStorage.getItem('oristep:paperStash');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try { localStorage.setItem('oristep:paperStash', JSON.stringify(papers)); } catch {}
  }, [papers]);

  const addPaper = useCallback((paperData: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newPaper: Paper = {
      ...paperData,
      id: createPaperId(),
      createdAt: now,
      updatedAt: now,
    };
    setPapers(prev => [newPaper, ...prev]);
  }, []);

  const updatePaper = useCallback((id: string, updates: Partial<Paper>) => {
    setPapers(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p)
    );
  }, []);

  const deletePaper = useCallback((id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
  }, []);
  
  const resetPaperStash = useCallback(() => {
    setPapers([]);
  }, []);

  const value = useMemo(() => ({
    papers, addPaper, updatePaper, deletePaper, resetPaperStash
  }), [papers, addPaper, updatePaper, deletePaper, resetPaperStash]);

  return (
    <PaperStashContext.Provider value={value}>
      {children}
    </PaperStashContext.Provider>
  );
}

export function usePaperStash() {
  const context = useContext(PaperStashContext);
  if (!context) {
    throw new Error('usePaperStash must be used within a PaperStashProvider');
  }
  return context;
}
