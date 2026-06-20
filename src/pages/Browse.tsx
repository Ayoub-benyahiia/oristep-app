import { useState, useMemo } from 'react';
import { usePatterns } from '../context/PatternContext';
import { PatternCard } from '../components/PatternCard';
import { Search, ChevronDown, X, Filter } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Browse() {
  const { data, toggleFavorite } = useProgress();
  const { patterns } = usePatterns();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Any time');
  const [sortMethod, setSortMethod] = useState('Recommended');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Animals', 'Objects', 'Nature', 'Modular', 'Beginner'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const times = ['Any time', 'Under 10 min', '10–20 min', '20+ min'];
  const sorts = ['Recommended', 'Easiest', 'Shortest', 'Most steps', 'Alphabetical'];

  const filteredAndSortedPatterns = useMemo(() => {
    let result = patterns;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== 'All') result = result.filter(p => p.category === categoryFilter);
    if (difficultyFilter !== 'All') result = result.filter(p => p.difficulty === difficultyFilter);
    if (timeFilter !== 'Any time') {
      result = result.filter(p => {
        if (timeFilter === 'Under 10 min') return p.estimatedTimeMinutes < 10;
        if (timeFilter === '10–20 min') return p.estimatedTimeMinutes >= 10 && p.estimatedTimeMinutes <= 20;
        if (timeFilter === '20+ min') return p.estimatedTimeMinutes > 20;
        return true;
      });
    }
    result = [...result].sort((a, b) => {
      switch (sortMethod) {
        case 'Easiest': {
          const diffMap: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return diffMap[a.difficulty] - diffMap[b.difficulty];
        }
        case 'Shortest': return a.estimatedTimeMinutes - b.estimatedTimeMinutes;
        case 'Most steps': return b.totalSteps - a.totalSteps;
        case 'Alphabetical': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });
    return result;
  }, [searchQuery, categoryFilter, difficultyFilter, timeFilter, sortMethod, patterns]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setDifficultyFilter('All');
    setTimeFilter('Any time');
    setSortMethod('Recommended');
  };

  return (
    <div className="pb-32 pt-12 space-y-6 max-w-md mx-auto min-h-screen flex flex-col text-ink">
      <div className="px-5 space-y-4 shrink-0">
        <header className="space-y-4">
          <h1 className="text-3xl font-heading text-ink">Browse</h1>
          
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
              <input 
                type="text" 
                placeholder="Search patterns or tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-paper rounded-full py-3.5 pl-11 pr-10 text-[13px] font-medium text-ink placeholder:text-ink-light/70 shadow-sm border border-crease-light focus:outline-none focus:border-accent transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-ink-light hover:text-ink" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                 "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm border",
                 showFilters || difficultyFilter !== 'All' || timeFilter !== 'Any time' || sortMethod !== 'Recommended'
                   ? "bg-ink text-paper-light border-ink"
                   : "bg-paper text-ink border-crease-light hover:border-ink/20"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                 "whitespace-nowrap px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm border",
                 categoryFilter === cat 
                   ? 'bg-ink text-paper-light border-ink' 
                   : 'bg-paper text-ink-light border-crease-light hover:border-ink/20 hover:text-ink'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
               <div className="p-6 bg-paper-light rounded-[2rem] border border-crease-light shadow-inner space-y-6 mt-1 mb-4">
                  <div className="space-y-3">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-ink-light">Sort By</label>
                     <div className="relative">
                        <select 
                          value={sortMethod}
                          onChange={(e) => setSortMethod(e.target.value)}
                          className="w-full appearance-none bg-paper border border-crease rounded-xl p-3 text-sm font-medium text-ink shadow-sm focus:outline-none focus:border-accent"
                        >
                           {sorts.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light pointer-events-none" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-ink-light">Difficulty</label>
                     <div className="flex flex-wrap gap-2">
                       {difficulties.map(diff => (
                         <button
                           key={diff}
                           onClick={() => setDifficultyFilter(diff)}
                           className={cn(
                             "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                             difficultyFilter === diff 
                               ? "bg-accent text-paper border-accent shadow-sm" 
                               : "bg-paper text-ink-light border-crease-light hover:bg-paper-light"
                           )}
                         >
                           {diff}
                         </button>
                       ))}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-ink-light">Time Required</label>
                     <div className="flex flex-wrap gap-2">
                       {times.map(t => (
                         <button
                           key={t}
                           onClick={() => setTimeFilter(t)}
                           className={cn(
                             "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                             timeFilter === t 
                               ? "bg-accent text-paper border-accent shadow-sm" 
                               : "bg-paper text-ink-light border-crease-light hover:bg-paper-light"
                           )}
                         >
                           {t}
                         </button>
                       ))}
                     </div>
                  </div>
                  
                  <div className="pt-4 border-t border-crease/50 text-right">
                     <button 
                       onClick={resetFilters}
                       className="text-[11px] font-bold text-ink-light uppercase tracking-widest hover:text-ink transition-colors px-3 py-2"
                     >
                       Reset Filters
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 flex-1 pb-10">
         <div className="mb-6 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-ink-light ml-2">
               {filteredAndSortedPatterns.length} {filteredAndSortedPatterns.length === 1 ? 'Result' : 'Results'}
            </span>
         </div>

         {filteredAndSortedPatterns.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {filteredAndSortedPatterns.map(pattern => {
                const prog = data.progress[pattern.id];
                const progressPercentage = prog ? ((prog.currentStepIndex + 1) / pattern.totalSteps) * 100 : 0;
                return (
                  <PatternCard 
                    key={pattern.id} 
                    pattern={pattern} 
                    completed={prog?.completed}
                    progressPercentage={progressPercentage}
                    isFavorite={data.favorites.includes(pattern.id)}
                    onToggleFavorite={() => toggleFavorite(pattern.id)}
                    showActions={true}
                  />
                )
             })}
           </div>
         ) : (
           <div className="bg-paper rounded-[2.5rem] border border-crease-light border-dashed p-10 flex flex-col items-center justify-center text-center shadow-sm mt-2">
             <div className="w-16 h-16 bg-paper-light rounded-full flex items-center justify-center mb-6 border border-crease-light">
               <Search className="w-6 h-6 text-ink-light" />
             </div>
             <h3 className="font-heading text-xl text-ink font-semibold mb-3">No patterns found</h3>
             <p className="text-[15px] font-medium text-ink-light mb-8 max-w-[200px] leading-relaxed">
               Try adjusting your search or filters to find what you're looking for.
             </p>
             <button 
               onClick={resetFilters}
               className="px-8 py-3.5 bg-ink text-paper-light rounded-full text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all"
             >
               Clear Filters
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
