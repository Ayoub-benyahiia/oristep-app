import React, { useState, useMemo } from 'react';
import { usePatterns } from '../context/PatternContext';
import { PatternDifficulty, PatternCategory } from '../types';
import { cn } from '../lib/utils';
import { ChevronRight, ArrowRight, CheckCircle2, Origami } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any, navigateTo?: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { patterns } = usePatterns();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [level, setLevel] = useState<PatternDifficulty>('Beginner');
  const [interests, setInterests] = useState<PatternCategory[]>([]);

  const levels: { id: PatternDifficulty; title: string; desc: string }[] = [
    { id: 'Beginner', title: 'Beginner', desc: 'New to origami or looking for simple folds.' },
    { id: 'Intermediate', title: 'Intermediate', desc: 'Comfortable with basic bases and squashes.' },
    { id: 'Advanced', title: 'Advanced', desc: 'Ready for complex sinks and multiple folds.' },
  ];

  const categories: { id: PatternCategory; title: string }[] = [
    { id: 'Animals', title: 'Animals' },
    { id: 'Objects', title: 'Objects' },
    { id: 'Nature', title: 'Nature' },
    { id: 'Modular', title: 'Modular' },
  ];

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleFinish = (route?: string) => {
    onComplete({ completed: true, level, interests }, route);
  };

  const recommended = useMemo(() => {
    let match = patterns.find(p => p.difficulty === level && interests.includes(p.category as PatternCategory));
    if (!match) match = patterns.find(p => p.difficulty === level);
    if (!match) match = patterns[0];
    return match;
  }, [level, interests, patterns]);

  return (
    <div className="absolute inset-0 bg-paper z-[100] overflow-hidden flex flex-col justify-center font-sans text-ink">
      {step > 0 && step < 3 && (
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-10 max-w-md mx-auto">
          <button 
             onClick={goPrev} 
             className="text-[11px] font-bold text-ink-light uppercase tracking-widest hover:text-ink transition-colors px-2 py-1 -ml-2"
          >
             Back
          </button>
          <div className="flex gap-1.5 pr-2">
            {[1, 2].map(i => (
               <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", step >= i ? "w-4 bg-ink" : "w-1.5 bg-crease")} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 w-full max-w-md mx-auto relative mt-16 md:mt-24 h-full">
        <div
          key={step}
          className="absolute inset-0 h-full overflow-y-auto scrollbar-hide pb-12 transition-opacity duration-300"
        >
            {step === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-md border border-crease font-bold text-accent mb-8 rotate-6">
                  <Origami className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-heading text-ink mb-4">Welcome to Oristep</h1>
                <p className="text-ink-light text-[15px] font-medium leading-relaxed max-w-[260px] mx-auto mb-12">
                  Learn origami step by step at your own pace. Discover the mindful art of paper folding.
                </p>
                <button onClick={goNext} className="w-full py-4 bg-ink text-paper-light rounded-full font-bold uppercase tracking-widest text-[11px] shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all shrink-0">
                  Begin
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col h-full px-6 pt-12 pb-8">
                <div className="flex-1">
                  <h2 className="text-3xl font-heading text-ink mb-2">What is your experience level?</h2>
                  <p className="text-ink-light text-sm font-medium mb-8">This helps us recommend the perfect starting point.</p>
                  
                  <div className="space-y-4 pb-8">
                    {levels.map(l => (
                      <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        className={cn(
                           "w-full text-left p-5 rounded-[1.5rem] border transition-all relative overflow-hidden",
                           level === l.id ? "bg-accent-soft/30 border-accent shadow-sm" : "bg-white border-crease shadow-sm hover:border-ink/20"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={cn("font-bold text-lg font-heading", level === l.id ? "text-accent" : "text-ink")}>{l.title}</h3>
                          <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", level === l.id ? "border-accent bg-accent text-paper" : "border-crease-light bg-paper-light")}>
                             {level === l.id && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>
                        <p className="text-ink-light text-xs mt-1 font-medium pr-8">{l.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={goNext} className="w-full py-4 bg-ink text-paper-light rounded-full font-bold uppercase tracking-widest text-[11px] shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all shrink-0 mt-6 mt-auto">
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col h-full px-6 pt-12 pb-8">
                <div className="flex-1">
                  <h2 className="text-3xl font-heading text-ink mb-2">What do you want to fold?</h2>
                  <p className="text-ink-light text-sm font-medium mb-8">Pick as many as you like. We'll tailor your library.</p>
                  
                  <div className="grid grid-cols-2 gap-4 pb-8">
                    {categories.map(cat => {
                       const isSelected = interests.includes(cat.id);
                       return (
                         <button
                           key={cat.id}
                           onClick={() => setInterests(isSelected ? interests.filter(i => i !== cat.id) : [...interests, cat.id])}
                           className={cn(
                             "aspect-[4/3] sm:aspect-square rounded-[2rem] border p-5 flex flex-col justify-end text-left transition-all",
                             isSelected ? "bg-ink text-paper-light border-ink shadow-md" : "bg-white border-crease shadow-sm text-ink hover:border-ink/20"
                           )}
                         >
                           <h3 className="font-heading font-semibold text-lg">{cat.title}</h3>
                         </button>
                       )
                    })}
                  </div>
                </div>
                <button 
                   onClick={goNext} 
                   disabled={interests.length === 0} 
                   className="w-full py-4 bg-ink text-paper-light rounded-full font-bold uppercase tracking-widest text-[11px] shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all shrink-0 mt-6 mt-auto disabled:opacity-30 disabled:hover:bg-ink disabled:active:scale-100"
                >
                  See Recommendation
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col h-full px-6 pt-12 pb-8">
                <div className="flex-1 text-center">
                  <div className="inline-block px-3 py-1 bg-accent-soft text-accent text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 mx-auto border border-crease-light shadow-sm">
                    Your Recommended Fold
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] border border-crease shadow-sm overflow-hidden text-left mb-8 mx-auto w-full max-w-sm">
                     <div className="aspect-[4/3] bg-paper-light relative">
                        <div className="absolute inset-0 opacity-40" style={{ background: recommended.imagePlaceholder }} />
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur pb-1 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-ink shadow-sm border border-white/50">
                           {recommended.difficulty}
                        </div>
                     </div>
                     <div className="p-6">
                        <h3 className="text-2xl font-heading text-ink mb-2 line-clamp-1">{recommended.title}</h3>
                        <p className="text-[13px] font-medium text-ink-light line-clamp-2 leading-relaxed">{recommended.description}</p>
                        <div className="flex items-center space-x-4 mt-6 pt-5 border-t border-crease-light text-[11px] uppercase font-bold tracking-widest text-ink-light">
                           <span>{recommended.estimatedTimeMinutes} min</span>
                           <span className="w-1 h-1 rounded-full bg-crease" />
                           <span>{recommended.totalSteps} steps</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-3 shrink-0 mt-6">
                  <button 
                    onClick={() => handleFinish(`/fold/${recommended.id}`)} 
                    className="w-full py-4 bg-accent text-paper rounded-full font-bold uppercase tracking-widest text-[11px] shadow-md hover:bg-accent-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Start Folding <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <button 
                    onClick={() => handleFinish('/browse')} 
                    className="w-full py-4 bg-transparent text-ink-light rounded-full font-bold uppercase tracking-widest text-[11px] hover:text-ink transition-colors"
                  >
                    Explore Library
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
