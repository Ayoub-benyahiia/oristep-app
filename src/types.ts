export type PatternDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type PatternCategory = 'Animals' | 'Objects' | 'Nature' | 'Modular' | 'Beginner';

export interface OrigamiStep {
  stepNumber: number;
  title: string;
  instruction: string;
  hint?: string;
  tip?: string;
  warning?: string;
  diagramPlaceholder?: string;
}

export interface OrigamiPattern {
  id: string;
  title: string;
  category: PatternCategory;
  difficulty: PatternDifficulty;
  estimatedTimeMinutes: number;
  totalSteps: number;
  paperSize: string;
  paperTypeRecommendation: string;
  description: string;
  tags: string[];
  imagePlaceholder: string;
  imageUrl?: string;
  steps?: OrigamiStep[];
}

export interface Paper {
  id: string;
  color: string;
  size: string;
  quantity: number;
  type: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProgress {
  patternId: string;
  currentStepIndex: number;
  lastAccessed: number;
  completed: boolean;
  completedDate?: number;
}

export interface UserData {
  favorites: string[];
  progress: Record<string, UserProgress>;
  stash: {
    squareCount: number;
    colors: string[];
  };
}
