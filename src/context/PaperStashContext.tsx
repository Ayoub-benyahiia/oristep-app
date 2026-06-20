import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Paper } from '../types';

interface PaperStashContextState {
  papers: Paper[];
  addPaper: (paper: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePaper: (id: string, updates: Partial<Paper>) => void;
  deletePaper: (id: string) => void;
  resetPaperStash: () => void;
}

const PaperStashContext = createContext<PaperStashContextState | undefined>(undefined);

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

  const addPaper = (paperData: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newPaper: Paper = {
      ...paperData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    setPapers(prev => [newPaper, ...prev]);
  };

  const updatePaper = (id: string, updates: Partial<Paper>) => {
    setPapers(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p)
    );
  };

  const deletePaper = (id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
  };
  
  const resetPaperStash = () => {
    setPapers([]);
  }

  return (
    <PaperStashContext.Provider value={{ papers, addPaper, updatePaper, deletePaper, resetPaperStash }}>
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
