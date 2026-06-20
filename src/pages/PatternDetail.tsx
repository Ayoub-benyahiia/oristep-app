import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Clock, BarChart, FileText, Minimize2 } from 'lucide-react';
import { usePatterns } from '../context/PatternContext';
import { useProgress } from '../context/ProgressContext';
import { cn, isSizeMatching, isTypeMatching } from '../lib/utils';
import React, { Fragment } from 'react';
import { usePaperStash } from '../context/PaperStashContext';

export function PatternDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, toggleFavorite, resetProgress, updateProgress } = useProgress();
  const { papers } = usePaperStash();
  const { patterns } = usePatterns();
  
  const pattern = patterns.find(p => p.id === id);
  
  if (!pattern) {
    return (
      <div className="p-8 text-center text-ink flex flex-col items-center justify-center min-h-screen space-y-4 bg-paper-light">
        <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center border border-crease shadow-sm">
          <span className="text-2xl opacity-50">?</span>
        </div>
        <div>
          <h1 className="text-2xl font-heading mb-1 font-bold">Pattern not found</h1>
          <p className="text-sm font-medium text-ink-light">We couldn't find the origami you're looking for.</p>
        </div>
        <Link to="/" className="px-6 py-3 bg-ink text-paper-light rounded-full text-xs font-bold uppercase tracking-widest mt-4 shadow-md hover:bg-ink-dark transition-all">Go Home</Link>
      </div>
    );
  }

  const isFavorite = data.favorites.includes(pattern.id);
  const progress = data.progress[pattern.id];
  const hasProgress = progress && !progress.completed && progress.currentStepIndex > 0;
  const isCompleted = progress?.completed;

  const handleStartWithReset = (e: React.MouseEvent) => {
     if (isCompleted || !progress) {
        resetProgress(pattern.id);
        updateProgress(pattern.id, 0, pattern.totalSteps, false);
     }
  }

  const hasMatchingPaper = papers.some(
    p => p.quantity > 0 && 
         isSizeMatching(p.size, pattern?.paperSize || '') && 
         isTypeMatching(p.type, pattern?.paperTypeRecommendation || '')
  );

  return (
    <div className="bg-paper-light min-h-screen pb-32">
      {/* Hero image area */}
      <div 
        className="relative h-80 w-full"
        style={{ background: pattern.imagePlaceholder }}
      >
        <div className="absolute top-4 w-full p-5 flex justify-between items-center z-10">
          {/* Glass buttons use bg-paper/70 — the CSS var flips to #18181b/70 in dark mode */}
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-paper/70 backdrop-blur-md flex items-center justify-center text-ink shadow-sm border border-crease-light/40 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => toggleFavorite(pattern.id)}
            className="w-10 h-10 rounded-full bg-paper/70 backdrop-blur-md flex items-center justify-center text-ink shadow-sm border border-crease-light/40 active:scale-95 transition-transform"
          >
            <Heart className={cn("w-5 h-5 transition-colors", isFavorite && "fill-red-500 text-red-500")} />
          </button>
        </div>
        
        {/* Hero gradient fades into page background — from-paper-light flips automatically */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-paper-light to-transparent" />
      </div>

      <div className="px-5 -mt-6 relative z-20 max-w-md mx-auto space-y-8">
        <header className="space-y-2 text-center md:text-left">
          <div className="flex gap-2 justify-center md:justify-start flex-wrap">
             <span className="text-accent text-[10px] font-bold tracking-widest uppercase bg-accent-soft px-3 py-1 rounded-full border border-crease-light">{pattern.category}</span>
             {pattern.tags.map(tag => (
                <span key={tag} className="text-ink-light opacity-80 text-[10px] font-bold tracking-widest uppercase bg-paper px-3 py-1 rounded-full border border-crease-light">
                   {tag}
                </span>
             ))}
          </div>
          <h1 className="text-4xl font-heading text-ink pt-3">{pattern.title}</h1>
          <p className="text-ink-light text-sm leading-relaxed pt-2 max-w-md">
            {pattern.description}
          </p>
        </header>

        {/* Stats bar */}
        <div className="flex bg-paper rounded-[2rem] p-6 justify-between border border-crease-light shadow-sm">
          <div className="flex flex-col items-center flex-1">
            <Clock className="w-5 h-5 text-accent mb-2 opacity-80" />
            <span className="text-sm font-bold text-ink">{pattern.estimatedTimeMinutes}m</span>
            <span className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Time</span>
          </div>
          <div className="w-px bg-crease-light" />
          <div className="flex flex-col items-center flex-1">
            <BarChart className="w-5 h-5 text-accent mb-2 opacity-80" />
            <span className="text-sm font-bold text-ink">{pattern.difficulty}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Level</span>
          </div>
          <div className="w-px bg-crease-light" />
          <div className="flex flex-col items-center flex-1">
            <FileText className="w-5 h-5 text-accent mb-2 opacity-80" />
            <span className="text-sm font-bold text-ink">{pattern.totalSteps}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Steps</span>
          </div>
        </div>

        {/* Requirements box */}
        <div className="bg-paper-light rounded-[2rem] p-6 border border-crease-light shadow-inner space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="font-heading text-lg text-ink font-semibold">Requirements</h3>
             {hasMatchingPaper && (
               <span className="text-[10px] bg-accent/10 text-accent px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-accent/20">
                 You have suitable paper
               </span>
             )}
           </div>
           <div className="space-y-3">
              <div className="flex items-center text-sm gap-3">
                 <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center border border-crease-light shrink-0">
                    <Minimize2 className="w-4 h-4 text-ink-light" />
                 </div>
                 <div>
                    <p className="font-bold text-ink text-xs uppercase tracking-wider">Paper Size</p>
                    <p className="text-ink-light text-sm mt-0.5">{pattern.paperSize}</p>
                 </div>
              </div>
              <div className="flex items-center text-sm gap-3">
                 <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center border border-crease-light shrink-0">
                    <FileText className="w-4 h-4 text-ink-light" />
                 </div>
                 <div>
                    <p className="font-bold text-ink text-xs uppercase tracking-wider">Paper Type</p>
                    <p className="text-ink-light text-sm mt-0.5">{pattern.paperTypeRecommendation}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-4">
          <Link 
            to={`/fold/${pattern.id}`}
            onClick={handleStartWithReset}
            className="w-full flex items-center justify-center py-4 bg-ink text-paper-light rounded-[1.5rem] font-bold tracking-widest uppercase text-xs shadow-lg hover:bg-ink-dark active:scale-[0.98] transition-all"
          >
            {hasProgress ? <>Continue Folding</> : isCompleted ? <>Fold Again</> : <>Start Fold Mode</>}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
