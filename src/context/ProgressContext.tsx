import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, UserProgress } from '../types';
import { safeGetJSON, safeSetJSON } from '../lib/utils';

interface ProgressContextState {
  data: UserData;
  toggleFavorite: (patternId: string) => void;
  updateProgress: (patternId: string, currentStepIndex: number, totalSteps: number, markCompleted?: boolean, timeTaken?: number) => void;
  resetProgress: (patternId: string) => void;
  resetAllProgress: () => void;
  resetFavorites: () => void;
  resetStash: () => void;
  resetAllData: () => void;
  toggleHaptics: () => void;
}

const defaultData: UserData = {
  favorites: [],
  progress: {},
  stash: { squareCount: 10, colors: ['#ffffff'] },
  settings: { hapticsEnabled: true },
};

const ProgressContext = createContext<ProgressContextState | undefined>(undefined);

const STORAGE_KEY = 'oristep_data_v1';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData>(() => {
    const parsed = safeGetJSON(STORAGE_KEY, defaultData);
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : defaultData.favorites,
      progress: typeof parsed.progress === 'object' && parsed.progress !== null ? parsed.progress : defaultData.progress,
      stash: parsed.stash || defaultData.stash,
      settings: parsed.settings || defaultData.settings,
    };
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEY, data);
  }, [data]);

  const toggleFavorite = (patternId: string) => {
    setData((prev) => {
      const favorites = prev.favorites.includes(patternId)
        ? prev.favorites.filter((id) => id !== patternId)
        : [...prev.favorites, patternId];
      return { ...prev, favorites };
    });
  };

  const recordActivityDate = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem('oristep:activityDates');
      let dates = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(dates)) dates = [];
      if (!dates.includes(today)) {
        dates.push(today);
        dates.sort();
        localStorage.setItem('oristep:activityDates', JSON.stringify(dates));
        window.dispatchEvent(new Event('oristep-activity'));
      }
    } catch {}
  };

  const updateProgress = (patternId: string, currentStepIndex: number, totalSteps: number, markCompleted: boolean = false, timeTaken?: number) => {
    recordActivityDate();
    setData((prev) => {
      const existing = prev.progress[patternId];
      const validStepIndex = Math.max(0, Math.min(currentStepIndex, totalSteps - 1));
      const completed = markCompleted || (existing?.completed && !markCompleted);
      const completedDate = (markCompleted && !existing?.completed) ? Date.now() : existing?.completedDate;
      const newProgress: UserProgress = {
        patternId,
        currentStepIndex: validStepIndex,
        lastAccessed: Date.now(),
        completed,
      };
      if (completedDate !== undefined) {
        newProgress.completedDate = completedDate;
      }
      if (completed && timeTaken) {
        if (!existing?.bestTime || timeTaken < existing.bestTime) {
          newProgress.bestTime = timeTaken;
        } else {
          newProgress.bestTime = existing.bestTime;
        }
      } else if (existing?.bestTime) {
        newProgress.bestTime = existing.bestTime;
      }
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [patternId]: newProgress,
        },
      };
    });
  };

  const resetProgress = (patternId: string) => {
    setData((prev) => {
      const newProgress = { ...prev.progress };
      delete newProgress[patternId];
      return { ...prev, progress: newProgress };
    });
  };

  const resetAllProgress = () => {
    setData(prev => ({ ...prev, progress: {} }));
  };

  const resetFavorites = () => {
    setData(prev => ({ ...prev, favorites: [] }));
  };

  const resetStash = () => {
    setData(prev => ({ ...prev, stash: defaultData.stash }));
  };

  const resetAllData = () => {
    setData(defaultData);
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('oristep')) localStorage.removeItem(k);
    });
    window.location.reload();
  };

  const toggleHaptics = () => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        hapticsEnabled: !(prev.settings?.hapticsEnabled ?? true)
      }
    }));
  };

  return (
    <ProgressContext.Provider value={{ 
      data, toggleFavorite, updateProgress, resetProgress,
      resetAllProgress, resetFavorites, resetStash, resetAllData, toggleHaptics
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
