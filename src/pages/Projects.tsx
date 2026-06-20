import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useAchievements, ACHIEVEMENTS } from '../context/AchievementContext';
import { usePatterns } from '../context/PatternContext';
import { PatternCard } from '../components/PatternCard';
import { Bookmark, FolderOpen, CheckCircle2, Trophy, Flame, CalendarDays, ChevronDown } from 'lucide-react';
import { UserProgress } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Projects() {
  const { data, toggleFavorite } = useProgress();
  const { achievements, streak, totalDays } = useAchievements();
  const { patterns } = usePatterns();
  const [showAchievements, setShowAchievements] = useState(false);

  const favoritePatterns = patterns.filter(p => data.favorites.includes(p.id));
  
  const inProgressPatterns = patterns.filter(
    p => data.progress[p.id] && !data.progress[p.id].completed
  );

  const completedList = (Object.values(data.progress) as UserProgress[])
    .filter(p => p.completed)
    .sort((a, b) => (b.completedDate || 0) - (a.completedDate || 0));

  const completedPatterns = completedList
    .map(p => patterns.find(pat => pat.id === p.patternId))
    .filter((pat): pat is NonNullable<typeof pat> => pat !== undefined);

  return (
    <div className="pb-32 px-5 pt-12 space-y-10 max-w-md mx-auto min-h-screen">
      <header className="space-y-4">
        <h1 className="text-3xl font-heading text-ink">Projects</h1>
      </header>

      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-paper p-5 rounded-[2rem] border border-crease shadow-sm flex flex-col items-center justify-center text-center">
            <Flame className="w-6 h-6 text-orange-500 mb-2" />
            <p className="text-2xl font-heading font-bold text-ink">{streak}</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold">Day Streak</p>
          </div>
          <div className="bg-paper p-5 rounded-[2rem] border border-crease shadow-sm flex flex-col items-center justify-center text-center">
            <CalendarDays className="w-6 h-6 text-accent mb-2" />
            <p className="text-2xl font-heading font-bold text-ink">{totalDays}</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold">Total Days</p>
          </div>
        </div>

        <div className="bg-paper-light rounded-[2rem] border border-crease-light overflow-hidden">
          <button 
            onClick={() => setShowAchievements(!showAchievements)}
            className="w-full p-5 flex items-center justify-between text-left focus:outline-none hover:bg-paper active:bg-paper transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent shadow-inner">
                 <Trophy className="w-5 h-5" />
              </div>
              <div>
                 <p className="font-bold text-sm text-ink">Achievements</p>
                 <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">
                   {Object.keys(achievements.unlockedDates).length} / {ACHIEVEMENTS.length} Unlocked
                 </p>
              </div>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-ink-light transition-transform", showAchievements && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {showAchievements && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 grid grid-cols-1 gap-4 border-t border-crease-light">
                   {ACHIEVEMENTS.map((ach) => {
                     const isUnlocked = !!achievements.unlockedDates[ach.id];
                     const unlockDate = isUnlocked ? new Date(achievements.unlockedDates[ach.id]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null;
                     return (
                       <div key={ach.id} className={cn("p-4 rounded-2xl border flex items-center space-x-4 transition-all", isUnlocked ? "bg-paper border-accent/20 shadow-sm" : "bg-transparent border-transparent opacity-60 grayscale")}>
                         <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-inner", isUnlocked ? "bg-accent-soft text-accent border-accent/10" : "bg-crease-light text-ink-light border-crease")}>
                           <ach.icon className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                            <h3 className="font-bold text-sm text-ink">{ach.title}</h3>
                            <p className="text-xs text-ink-light font-medium mt-0.5">{ach.description}</p>
                            {isUnlocked && (
                              <p className="text-[9px] uppercase tracking-widest font-bold text-accent mt-1.5">Unlocked {unlockDate}</p>
                            )}
                         </div>
                       </div>
                     )
                   })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-ink flex items-center tracking-widest uppercase font-bold">
          <FolderOpen className="w-4 h-4 mr-2 text-accent" /> In Progress
        </h2>
        {inProgressPatterns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {inProgressPatterns.map(pattern => {
              const prog = data.progress[pattern.id];
              const pct = prog ? ((prog.currentStepIndex + 1) / pattern.totalSteps) * 100 : 0;
              return (
                <PatternCard 
                  key={pattern.id} 
                  pattern={pattern} 
                  progressPercentage={pct} 
                  isFavorite={data.favorites.includes(pattern.id)}
                  onToggleFavorite={() => toggleFavorite(pattern.id)}
                  showActions={true}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center bg-paper flex flex-col items-center rounded-[2rem] border border-crease-light border-dashed shadow-sm">
             <FolderOpen className="w-8 h-8 text-ink-light opacity-50 mb-4" />
             <p className="text-ink text-sm font-bold mb-1">No active projects</p>
             <p className="text-ink-light text-xs font-medium">Start folding a new pattern to see it here.</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-ink flex items-center tracking-widest uppercase mt-8 font-bold">
          <Bookmark className="w-4 h-4 mr-2 text-red-500" /> Favorites
        </h2>
        {favoritePatterns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favoritePatterns.map(pattern => {
               const prog = data.progress[pattern.id];
               const pct = prog ? ((prog.currentStepIndex + 1) / pattern.totalSteps) * 100 : 0;
               return (
                 <PatternCard 
                   key={pattern.id} 
                   pattern={pattern} 
                   progressPercentage={pct}
                   completed={prog?.completed}
                   isFavorite={true}
                   onToggleFavorite={() => toggleFavorite(pattern.id)}
                   showActions={true}
                 />
               );
            })}
          </div>
        ) : (
          <div className="p-10 text-center bg-paper flex flex-col items-center rounded-[2rem] border border-crease-light border-dashed shadow-sm">
             <Bookmark className="w-8 h-8 text-ink-light opacity-50 mb-4" />
             <p className="text-ink text-sm font-bold mb-1">No favorites yet</p>
             <p className="text-ink-light text-xs font-medium">Save patterns you love to find them here later.</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-ink flex items-center tracking-widest uppercase mt-8 font-bold">
          <CheckCircle2 className="w-4 h-4 mr-2 text-accent" /> Completed
        </h2>
        {completedPatterns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {completedPatterns.map(pattern => (
              <PatternCard 
                key={pattern.id} 
                pattern={pattern} 
                completed={true}
                isFavorite={data.favorites.includes(pattern.id)}
                onToggleFavorite={() => toggleFavorite(pattern.id)}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-paper flex flex-col items-center rounded-[2rem] border border-crease-light border-dashed shadow-sm">
             <CheckCircle2 className="w-8 h-8 text-ink-light opacity-50 mb-4" />
             <p className="text-ink text-sm font-bold mb-1">No completed projects</p>
             <p className="text-ink-light text-xs font-medium">Complete a pattern to see it here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
