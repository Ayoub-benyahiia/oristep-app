import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Check, HelpCircle } from 'lucide-react';
import { usePatterns } from '../context/PatternContext';
import { useProgress } from '../context/ProgressContext';
import { fetchPatternSteps } from '../services/patternService';
import { cn } from '../lib/utils';
import { OrigamiStep } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function FoldMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, updateProgress } = useProgress();
  const { patterns } = usePatterns();
  
  const pattern = patterns.find(p => p.id === id);
  const progress = pattern ? data.progress[pattern.id] : null;

  const [viewIndex, setViewIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [steps, setSteps] = useState<OrigamiStep[]>(pattern?.steps || []);
  const [isLoadingSteps, setIsLoadingSteps] = useState(pattern && !pattern.steps ? true : false);

  useEffect(() => {
    if (progress && !progress.completed) {
       setViewIndex(Math.max(0, Math.min(progress.currentStepIndex, (pattern?.totalSteps || 1) - 1)));
    }
  }, []);

  useEffect(() => {
    if (pattern && (!pattern.steps || pattern.steps.length === 0)) {
      setIsLoadingSteps(true);
      fetchPatternSteps(pattern.id).then(fetchedSteps => {
        setSteps(fetchedSteps);
        setIsLoadingSteps(false);
      });
    } else if (pattern?.steps) {
      setSteps(pattern.steps);
    }
  }, [pattern]);

  if (!pattern) return (
    <div className="absolute inset-0 bg-paper-light z-[100] flex flex-col items-center justify-center p-6 text-center text-ink">
       <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center shadow-sm border border-crease mb-6">
          <X className="w-8 h-8 text-ink-light" />
       </div>
       <h1 className="font-heading text-3xl mb-2">Pattern Not Found</h1>
       <p className="text-ink-light text-sm mb-8 font-medium">This folding pattern might have been removed or doesn't exist.</p>
       <button onClick={() => navigate('/')} className="px-8 py-3 bg-ink text-paper-light rounded-full font-bold uppercase tracking-widest text-xs shadow-md hover:bg-ink-dark transition-all">
          Go Home
       </button>
    </div>
  );

  if (isLoadingSteps) return (
    <div className="absolute inset-0 bg-paper-light z-[100] flex flex-col items-center justify-center p-6 text-center text-ink">
       <div className="w-12 h-12 rounded-full border-4 border-ink/20 border-t-ink animate-spin mb-6"></div>
       <p className="text-ink-light text-sm font-medium uppercase tracking-widest">Loading Steps...</p>
    </div>
  );

  const step = steps[viewIndex];
  const total = pattern.totalSteps || steps.length;
  if (!step) return null;
  
  const isLastStep = viewIndex === total - 1;
  const progressPercentage = ((viewIndex + 1) / total) * 100;
  const maxReached = progress ? progress.currentStepIndex : 0;
  const isCompleted = progress?.completed || false;

  let primaryText = "Mark Step Done";
  if (isLastStep) primaryText = "Finish Project";
  else if (isCompleted || viewIndex < maxReached) primaryText = "Next Step";

  const handlePrimary = () => {
    if (isLastStep) {
      updateProgress(pattern.id, viewIndex, total, true);
      setShowCompletion(true);
    } else if (isCompleted || viewIndex < maxReached) {
      setDirection(1); setShowHint(false); setViewIndex(viewIndex + 1);
    } else {
      const nextIdx = viewIndex + 1;
      updateProgress(pattern.id, nextIdx, total, false);
      setDirection(1); setShowHint(false); setViewIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    if (viewIndex > 0) { setDirection(-1); setShowHint(false); setViewIndex(viewIndex - 1); }
  };

  return (
    <div className="absolute inset-0 bg-paper-light z-[100] flex flex-col items-center overflow-hidden h-full text-ink">
      {/* Progress bar — track uses crease-light token */}
      <div className="w-full h-1.5 bg-crease-light absolute top-0 z-10">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 py-4 pt-12 relative z-20 shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center text-ink bg-paper rounded-full shadow-sm border border-crease-light active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center flex-1">
          <div className="text-[10px] font-bold tracking-widest uppercase text-ink-light">{pattern.title}</div>
          <div className="font-heading text-lg text-ink">
            Step {viewIndex + 1} <span className="text-ink-light font-sans text-sm">of {total}</span>
          </div>
        </div>
        <div className="w-12 h-12" /> 
      </div>

      {/* Content area */}
      <div className="flex-1 w-full max-w-md mx-auto relative flex flex-col px-6 pb-6 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={viewIndex}
            custom={direction}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full w-full pt-4"
          >
            {/* HYBRID MODEL RULE 1: SHOW IMAGE ON STEP 1 */}
            {viewIndex === 0 && (
              <div className="w-full aspect-[4/3] rounded-[2rem] bg-paper shadow-sm border border-crease-light relative flex flex-col pt-12 text-center overflow-hidden shrink-0">
                 <div className="absolute inset-0 opacity-[0.25]" style={{ background: pattern.imagePlaceholder }} />
                 {/* from-paper uses CSS var — flips automatically */}
                 <div className="absolute inset-0 bg-gradient-to-t from-paper/40 via-transparent to-transparent pointer-events-none" />
                 
                 <div className="relative z-10 my-auto">
                   <div className="w-20 h-20 mx-auto rounded-3xl bg-paper shadow-sm border border-crease flex items-center justify-center rotate-6 hover:rotate-0 transition-transform">
                      <span className="font-heading text-3xl font-bold text-ink opacity-30">{step.stepNumber}</span>
                   </div>
                   <div className="mt-8">
                     <span className="text-[10px] uppercase font-bold tracking-widest text-ink-light/80 bg-paper px-4 py-2 rounded-full shadow-sm border border-crease-light">
                       Goal Thumbnail
                     </span>
                   </div>
                 </div>
              </div>
            )}

            {/* HYBRID MODEL RULE 2: DEEP FOCUS TEXT MODE */}
            <div 
              className={cn(
                "text-center flex flex-col shrink-0 pb-12 transition-all duration-700 ease-in-out",
                viewIndex === 0 ? "mt-10" : "flex-grow justify-center mt-0"
              )}
            >
              <h2 className={cn(
                "font-heading text-ink mb-4 transition-all duration-500",
                viewIndex === 0 ? "text-3xl" : "text-4xl md:text-5xl lg:text-6xl px-4"
              )}>{step.title}</h2>
              
              <p className={cn(
                "leading-relaxed text-ink font-medium px-2 transition-all duration-500",
                viewIndex === 0 ? "text-[15px]" : "text-xl md:text-2xl mt-4 px-6 md:px-12"
              )}>
                {step.instruction}
              </p>

                {(step.hint || step.tip) && (
                <div className={cn("flex flex-col items-center", viewIndex === 0 ? "mt-8" : "mt-12")}>
                  <button
                     onClick={() => setShowHint(!showHint)}
                     className={cn(
                       "uppercase font-bold tracking-widest flex items-center gap-1.5 focus:outline-none bg-paper rounded-full shadow-sm border border-crease-light active:scale-95 transition-all",
                       viewIndex === 0 ? "text-[11px] text-accent px-4 py-2" : "text-sm text-accent-dark px-6 py-3"
                     )}
                  >
                     <HelpCircle className={cn("w-4 h-4", viewIndex > 0 && "w-5 h-5")} />
                     {showHint ? "Hide Hint" : "Need Help?"}
                  </button>
                  <AnimatePresence>
                     {showHint && (
                        <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                           className="overflow-hidden w-full mt-4"
                        >
                           {/* bg-accent-soft uses CSS var — flips to dark olive tint automatically */}
                           <div className={cn(
                             "bg-accent-soft text-accent-dark rounded-[1.5rem] font-medium border border-accent/10 shadow-inner",
                             viewIndex === 0 ? "p-5 text-sm" : "p-8 text-lg mx-4 mt-2"
                           )}>
                              {step.tip || step.hint}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls — bg-paper-light flips automatically */}
      <div className="w-full max-w-md mx-auto px-6 pb-safe pt-4 flex gap-4 shrink-0 bg-paper-light z-20 border-t border-crease-light">
        <button
          onClick={handlePrev}
          disabled={viewIndex === 0}
          className="w-14 h-14 rounded-full flex items-center justify-center text-ink bg-paper shadow-sm border border-crease-light disabled:opacity-30 transition-all active:scale-95 shrink-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={handlePrimary}
          className={cn(
            "flex-1 h-14 rounded-full flex items-center justify-center font-bold text-xs uppercase tracking-widest shadow-md active:scale-[0.98] transition-all",
            isLastStep ? "bg-ink text-paper-light hover:bg-ink-dark" : "bg-accent text-paper hover:bg-accent-dark"
          )}
        >
          {primaryText}
          {isLastStep ? <Check className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {/* Completion Modal — bg-ink/70 backdrop, bg-paper card */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[200] bg-ink/70 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-paper rounded-[2.5rem] p-8 text-center shadow-2xl border border-crease text-ink"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent-soft text-accent flex items-center justify-center shadow-inner border border-accent/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ background: pattern.imagePlaceholder }} />
                <svg width="40" height="30" viewBox="0 0 14 10" fill="none" className="w-10 h-10 stroke-current text-accent relative z-10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 5L4.5 8.5L13 1" />
                </svg>
              </div>
              <h2 className="text-3xl font-heading mb-3">Masterful Fold!</h2>
              <p className="text-ink-light font-medium text-[15px] leading-relaxed mb-8 px-2">
                You have successfully completed the {pattern.title}.
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 rounded-full bg-ink text-paper-light font-bold tracking-widest uppercase text-xs shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all"
              >
                Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
