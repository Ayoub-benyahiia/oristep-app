import { supabase } from '../lib/supabase';
import { OrigamiPattern, OrigamiStep } from '../types';
import { PATTERNS as LOCAL_PATTERNS } from '../data';

export async function fetchPatterns(): Promise<OrigamiPattern[]> {
  if (!supabase) {
    return LOCAL_PATTERNS;
  }

  try {
    const { data: patternsData, error } = await supabase
      .from('patterns')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    if (!patternsData || patternsData.length === 0) {
      return LOCAL_PATTERNS; // Fallback if DB is empty but supposed to have data
    }

    return patternsData.map(p => ({
      id: p.id,
      slug: p.slug || p.id,
      title: p.title,
      category: p.category as OrigamiPattern['category'],
      difficulty: p.difficulty as OrigamiPattern['difficulty'],
      estimatedTimeMinutes: p.estimated_minutes,
      totalSteps: p.total_steps || 1, // Fallback if total_steps is not pre-computed
      paperSize: p.paper_size,
      paperTypeRecommendation: p.paper_type_recommendation,
      description: p.description,
      tags: p.tags || [],
      isPublished: p.is_published ?? true,
      isFeatured: p.is_featured ?? false,
      imagePlaceholder: p.image_placeholder,
      imageUrl: p.image_url,
    }));
  } catch (err) {
    console.error('Error fetching patterns from Supabase:', err);
    return LOCAL_PATTERNS; // Fallback on error
  }
}

export async function fetchPatternSteps(patternId: string): Promise<OrigamiStep[]> {
  if (!supabase) {
    // Local fallback: extract steps from LOCAL_PATTERNS
    const localPattern = LOCAL_PATTERNS.find(p => p.id === patternId);
    return localPattern?.steps || [];
  }

  try {
    const { data: stepsData, error } = await supabase
      .from('pattern_steps')
      .select('*')
      .eq('pattern_id', patternId)
      .order('step_number', { ascending: true });

    if (error) throw error;

    if (!stepsData || stepsData.length === 0) {
      const localPattern = LOCAL_PATTERNS.find(p => p.id === patternId);
      return localPattern?.steps || [];
    }

    return stepsData.map(s => ({
      stepNumber: s.step_number,
      title: s.title,
      instruction: s.instruction,
      hint: s.hint || undefined,
      tip: s.tip || undefined,
      warning: s.warning || undefined,
      diagramPlaceholder: s.diagram_placeholder || undefined,
    } as OrigamiStep));
  } catch (err) {
    console.error(`Error fetching steps for pattern ${patternId} from Supabase:`, err);
    const localPattern = LOCAL_PATTERNS.find(p => p.id === patternId);
    return localPattern?.steps || [];
  }
}
