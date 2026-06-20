import { useProgress } from '../context/ProgressContext';
import { usePatterns } from '../context/PatternContext';
import { PatternCard } from '../components/PatternCard';
import { ArrowRight, Sparkles, CheckCircle2, Clock, Layers, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProgress } from '../types';
import { getLocalDayNumber } from '../lib/utils';
import { useMemo } from 'react';

export function Home() {
  const { data, toggleFavorite } = useProgress();
  const { patterns } = usePatterns();
  
  const inProgressList = (Object.values(data.progress) as UserProgress[])
    .filter(p => !p.completed)
    .sort((a, b) => b.lastAccessed - a.lastAccessed);
    
  const currentProject = inProgressList.length > 0 ? inProgressList[0] : null;
  const currentPattern = currentProject 
    ? patterns.find(p => p.id === currentProject.patternId) 
    : null;

  const completedList = (Object.values(data.progress) as UserProgress[])
    .filter(p => p.completed)
    .sort((a, b) => (b.completedDate || 0) - (a.completedDate || 0));

  const recentlyCompleted = completedList
    .map(p => patterns.find(pat => pat.id === p.patternId))
    .filter((pat): pat is NonNullable<typeof pat> => pat !== undefined)
    .slice(0, 2);

  const [dailyFoldPattern, altDailyFoldPattern] = useMemo(() => {
    let candidates = patterns;
    try {
      const saved = localStorage.getItem('oristep:onboarding');
      if (saved) {
        const onboarding = JSON.parse(saved);
        if (onboarding.completed) {
          const filtered = patterns.filter(p => {
            const matchesLevel = p.difficulty === onboarding.level;
            const matchesInterest = Array.isArray(onboarding.interests) && onboarding.interests.includes(p.category);
            return matchesLevel || matchesInterest;
          });
          if (filtered.length > 0) candidates = filtered;
        }
      }
    } catch {}
    if (candidates.length === 0) candidates = patterns;
    if (candidates.length === 0) return [null, null];
    const dayNumber = getLocalDayNumber();
    return [candidates[dayNumber % candidates.length], candidates[(dayNumber + 1) % candidates.length]];
  }, [patterns]);

  const isDailyCompleted = dailyFoldPattern && data.progress[dailyFoldPattern.id]?.completed;
  const targetDailyFold = isDailyCompleted ? altDailyFoldPattern : dailyFoldPattern;

  return (
    <div className="pb-32 px-5 pt-12 space-y-10 max-w-md mx-auto relative">
      <header className="space-y-1">
        <h1 className="text-3xl font-heading text-ink">Welcome back</h1>
        <p className="text-ink-light text-sm">Find your next origami project.</p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-ink flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-accent" /> Daily Fold
          </h2>
        </div>
        
        {isDailyCompleted && !targetDailyFold && (
           <div className="bg-paper rounded-[2rem] p-6 shadow-sm border border-crease-light flex flex-col items-center justify-center text-center space-y-3">
             <div className="w-14 h-14 rounded-full bg-accent-soft text-accent flex items-center justify-center border border-accent/20">
               <CheckCircle2 className="w-7 h-7" />
             </div>
             <div>
               <h3 className="font-heading font-bold text-ink text-lg">Completed today</h3>
             </div>
           </div>
        )}

        {targetDailyFold && (
          <div className="bg-paper rounded-[2.5rem] p-5 shadow-sm border border-crease overflow-hidden group">
            <div 
              className="w-full aspect-[4/3] rounded-[2rem] mb-5"
              style={{ background: targetDailyFold.imagePlaceholder }}
            />
            <div className="px-2 pb-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[9px] uppercase tracking-widest font-bold bg-paper-light border border-crease-light text-ink-light px-3 py-1 rounded-full">
                  {targetDailyFold.category}
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold bg-paper-light border border-crease-light text-ink-light px-3 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1 inline" /> {targetDailyFold.difficulty}
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-ink leading-tight mb-2">
                {targetDailyFold.title}
              </h3>
              <p className="text-sm font-medium text-ink-light leading-relaxed mb-6 line-clamp-2">
                {targetDailyFold.description}
              </p>
              
              <div className="flex items-center justify-between mb-6 border-y border-crease py-4">
                <div className="flex flex-col items-center flex-1">
                  <Clock className="w-5 h-5 text-ink-light mb-1" />
                  <span className="text-xs font-bold text-ink">{targetDailyFold.estimatedTimeMinutes} min</span>
                </div>
                <div className="flex flex-col items-center flex-1 border-l border-crease">
                  <Layers className="w-5 h-5 text-ink-light mb-1" />
                  <span className="text-xs font-bold text-ink">{targetDailyFold.totalSteps} steps</span>
                </div>
              </div>

              <Link 
                to={`/fold/${targetDailyFold.id}`}
                className="w-full flex items-center justify-center py-4 bg-ink text-paper-light rounded-[1.5rem] font-bold tracking-widest uppercase text-xs shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all"
              >
                {data.progress[targetDailyFold.id] && data.progress[targetDailyFold.id].currentStepIndex > 0 && !data.progress[targetDailyFold.id].completed ? "Continue Folding" : "Start Folding"}
              </Link>
            </div>
          </div>
        )}
      </section>

      {currentProject && currentPattern && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold text-ink">Continue Folding</h2>
            <Link to="/projects" className="text-accent text-xs font-bold uppercase tracking-wider flex items-center">
              All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="relative p-6 rounded-[2.5rem] bg-paper border border-crease-light flex items-center justify-between group shadow-sm">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-2xl shrink-0 opacity-80" 
                style={{ background: currentPattern.imagePlaceholder }}
              />
              <div>
                <span className="inline-block px-3 py-1 bg-accent-soft text-accent text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">Current Project</span>
                <h3 className="font-heading text-xl font-semibold text-ink">{currentPattern.title}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-24 h-1.5 bg-paper-light rounded-full overflow-hidden border border-crease-light">
                    <div className="h-full bg-accent" style={{ width: `${((currentProject.currentStepIndex + 1) / currentPattern.totalSteps) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-ink-light font-bold uppercase tracking-widest">
                    Step {currentProject.currentStepIndex + 1}
                  </p>
                </div>
              </div>
            </div>
            <Link 
              to={`/fold/${currentPattern.id}`}
              className="w-12 h-12 rounded-full bg-ink text-paper-light flex items-center justify-center hover:bg-ink-dark transition-colors shrink-0 shadow-md ml-4"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {recentlyCompleted.length > 0 && (
         <section className="space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-lg font-heading font-semibold text-ink flex items-center">
               <CheckCircle2 className="w-4 h-4 mr-2 text-accent" /> Recently Completed
             </h2>
             <Link to="/projects" className="text-accent text-xs font-bold uppercase tracking-wider flex items-center">
               View <ArrowRight className="w-4 h-4 ml-1" />
             </Link>
           </div>
           <div className="grid grid-cols-2 gap-6">
             {recentlyCompleted.map(pattern => (
               <PatternCard 
                 key={pattern.id} 
                 pattern={pattern} 
                 completed={true}
                 isFavorite={data.favorites.includes(pattern.id)}
                 onToggleFavorite={() => toggleFavorite(pattern.id)}
               />
             ))}
           </div>
         </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-ink">Explore More</h2>
        <div className="grid grid-cols-2 gap-6">
          {patterns.slice(1, 4).map(pattern => (
            <PatternCard 
              key={pattern.id} 
              pattern={pattern}
              isFavorite={data.favorites.includes(pattern.id)}
              onToggleFavorite={() => toggleFavorite(pattern.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
