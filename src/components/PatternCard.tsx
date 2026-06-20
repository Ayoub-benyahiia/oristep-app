import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart, Heart, Check } from 'lucide-react';
import { OrigamiPattern } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface PatternCardProps {
  key?: React.Key | string | number;
  pattern: OrigamiPattern;
  completed?: boolean;
  progressPercentage?: number;
  featured?: boolean;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  showActions?: boolean;
}

export function PatternCard({ pattern, completed, progressPercentage, featured, className, isFavorite, onToggleFavorite, showActions }: PatternCardProps) {
  const navigate = useNavigate();
  
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/fold/${pattern.id}`);
  };

  return (
    <div className={cn("block h-full cursor-default sm:cursor-pointer", className)}>
      <motion.div 
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/pattern/${pattern.id}`)}
        className={cn(
          "relative overflow-hidden rounded-[2rem] bg-paper border border-crease-light shadow-sm transition-all group flex flex-col h-full cursor-pointer",
          featured ? "aspect-[4/3]" : (showActions ? "aspect-[3/4]" : "aspect-[3/3]")
        )}
      >
        {/* Pattern gradient background */}
        <div 
          className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
          style={{ background: pattern.imagePlaceholder }}
        />
        
        {/* Gradient overlay — from-paper uses CSS var, flips in dark mode automatically */}
        <div className="absolute inset-0 bg-gradient-to-tr from-paper/90 via-paper/50 to-transparent opacity-90 pointer-events-none" />
        {/* Corner blur using CSS var */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-paper blur-2xl rounded-full pointer-events-none" />
        
        {/* Card content */}
        <div className="relative z-10 p-5 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 bg-accent-soft text-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-crease shadow-sm">
              {pattern.category}
            </span>
            <div className="flex gap-2 relative z-20">
              {completed && (
                <span className="w-8 h-8 flex items-center justify-center bg-accent text-paper rounded-full shadow-sm">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </span>
              )}
              {onToggleFavorite && (
                 <button 
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(e); }}
                   className="w-8 h-8 flex items-center justify-center bg-paper/70 backdrop-blur-md rounded-full shadow-sm border border-crease-light/60"
                 >
                   <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")} />
                 </button>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mt-auto text-ink">
            <h3 className="text-xl font-heading font-semibold text-ink line-clamp-2">
              {pattern.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-light font-bold pb-1">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{pattern.estimatedTimeMinutes}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart className="w-3.5 h-3.5" />
                <span>{pattern.difficulty}</span>
              </div>
              <div className="flex items-center space-x-1 whitespace-nowrap">
                <span className="text-[10px] uppercase tracking-widest opacity-80">{pattern.totalSteps} Steps</span>
              </div>
            </div>
            
            {showActions && (
              <div className="pt-3 mt-3 border-t border-crease flex gap-2 relative z-20">
                <button 
                  onClick={handleActionClick}
                  className={cn(
                     "flex-1 py-3 rounded-full flex items-center justify-center text-[10px] uppercase font-bold tracking-widest transition-colors shadow-sm",
                     (progressPercentage && progressPercentage > 0 && !completed) 
                        ? "bg-accent text-paper hover:bg-accent-dark" 
                        : "bg-ink text-paper-light hover:bg-ink-dark"
                  )}
                >
                  {(progressPercentage && progressPercentage > 0 && !completed) ? "Continue" : (completed ? "Fold Again" : "Start")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* In-progress bar — crease-light track uses CSS var */}
        {progressPercentage !== undefined && progressPercentage > 0 && progressPercentage < 100 && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-crease-light z-20 pointer-events-none">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
