import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProgress } from './ProgressContext';
import { usePatterns } from './PatternContext';
import { Target, Star, CalendarDays, Bird, Award, LibraryBig, Sparkles, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_fold', title: 'First Fold', description: 'Complete your first origami project.', icon: Sparkles },
  { id: 'animal_folder', title: 'Animal Folder', description: 'Complete 3 animal patterns.', icon: Bird },
  { id: 'getting_started', title: 'Getting Started', description: 'Start 3 different patterns.', icon: CheckSquare },
  { id: 'consistent_folder', title: 'Consistent Folder', description: 'Fold on 3 different days.', icon: CalendarDays },
  { id: 'crane_master', title: 'Crane Master', description: 'Complete the Paper Crane.', icon: Award },
  { id: 'beginner_master', title: 'Beginner Master', description: 'Complete every beginner pattern in the library.', icon: Star },
  { id: 'collector', title: 'Collector', description: 'Add 5 patterns to favorites.', icon: LibraryBig },
  { id: 'patient_hands', title: 'Patient Hands', description: 'Complete the longest pattern in the library.', icon: Target },
];

export interface AchievementState {
  unlockedDates: Record<string, number>;
}

interface AchievementContextState {
  achievements: AchievementState;
  activityDates: string[];
  streak: number;
  totalDays: number;
  resetAchievements: () => void;
}

const AchievementContext = createContext<AchievementContextState | undefined>(undefined);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { data } = useProgress();
  const { patterns } = usePatterns();
  
  const [activityDates, setActivityDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('oristep:activityDates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [achievements, setAchievements] = useState<AchievementState>(() => {
    try {
      const saved = localStorage.getItem('oristep:achievements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.unlockedDates) {
          return parsed;
        }
      }
    } catch {}
    return { unlockedDates: {} };
  });

  const [toast, setToast] = useState<Achievement | null>(null);

  useEffect(() => {
    const handleActivity = () => {
       try {
         const saved = localStorage.getItem('oristep:activityDates');
         if (saved) setActivityDates(JSON.parse(saved));
       } catch {}
    };
    window.addEventListener('oristep-activity', handleActivity);
    return () => window.removeEventListener('oristep-activity', handleActivity);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('oristep:achievements', JSON.stringify(achievements)); } catch {}
  }, [achievements]);

  // Evaluate achievements
  useEffect(() => {
    const newlyUnlocked: Achievement[] = [];
    
    const completedPatternIds = Object.keys(data.progress).filter(id => data.progress[id].completed);
    const completedPatterns = completedPatternIds.map(id => patterns.find(p => p.id === id)).filter(Boolean) as typeof patterns;

    const checkAndUnlock = (id: string, condition: boolean) => {
      if (condition && !achievements.unlockedDates[id]) {
        newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === id)!);
      }
    };

    checkAndUnlock('first_fold', completedPatternIds.length >= 1);
    checkAndUnlock('animal_folder', completedPatterns.filter(p => p.category === 'Animals').length >= 3);
    checkAndUnlock('getting_started', Object.keys(data.progress).length >= 3);
    checkAndUnlock('consistent_folder', activityDates.length >= 3);
    checkAndUnlock('crane_master', completedPatternIds.includes('paper-crane'));
    const beginnerPatternCount = patterns.filter(p => p.difficulty === 'Beginner').length;
    checkAndUnlock(
      'beginner_master',
      beginnerPatternCount > 0 && completedPatterns.filter(p => p.difficulty === 'Beginner').length >= beginnerPatternCount
    );
    checkAndUnlock('collector', data.favorites.length >= 5);
    const maxStepCount = Math.max(0, ...patterns.map(p => p.totalSteps));
    checkAndUnlock('patient_hands', maxStepCount > 0 && completedPatterns.some(p => p.totalSteps === maxStepCount));

    if (newlyUnlocked.length > 0) {
      setAchievements(prev => {
        const next = { ...prev, unlockedDates: { ...prev.unlockedDates } };
        const now = Date.now();
        newlyUnlocked.forEach(a => {
          next.unlockedDates[a.id] = now;
        });
        return next;
      });
      
      // Show toast for the first newly unlocked
      setToast(newlyUnlocked[0]);
    }
  }, [data, activityDates, patterns]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const resetAchievements = () => {
    setAchievements({ unlockedDates: {} });
    setActivityDates([]);
    try { localStorage.removeItem('oristep:activityDates'); } catch {}
  };

  // Compute streak
  const streak = Object.keys(data.progress).length === 0 ? 0 : (() => {
    if (activityDates.length === 0) return 0;
    
    const dates = Array.from(new Set<string>(activityDates))
      .filter(d => typeof d === 'string')
      .sort((a, b) => a.localeCompare(b))
      .reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let currentStreak = 0;
    let expectedDate = dates[0] === todayStr ? todayStr : (dates[0] === yesterdayStr ? yesterdayStr : null);
    
    if (!expectedDate) return 0;

    for (const d of dates) {
      if (d === expectedDate) {
        currentStreak++;
        try {
          const currDate = new Date(d + 'T00:00:00Z');
          currDate.setUTCDate(currDate.getUTCDate() - 1);
          expectedDate = currDate.toISOString().split('T')[0];
        } catch {
          break;
        }
      } else {
        break;
      }
    }
    return currentStreak;
  })();

  return (
    <AchievementContext.Provider value={{
      achievements,
      activityDates,
      streak,
      totalDays: activityDates.length,
      resetAchievements
    }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] w-max max-w-[90vw]"
          >
            <div className="bg-ink text-paper-light px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-3 border border-ink-light/20">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <toast.icon className="w-4 h-4" />
              </div>
              <div className="pr-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Achievement Unlocked</p>
                <p className="font-heading text-sm font-semibold">{toast.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
