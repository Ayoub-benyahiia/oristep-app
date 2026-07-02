import { collection, getDocs, getDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db } from '../lib/firebase';
import { OrigamiPattern, OrigamiStep } from '../types';
import { PATTERNS as LOCAL_PATTERNS } from '../data';

export async function fetchPatterns(): Promise<OrigamiPattern[]> {
  const CACHE_KEY = 'oristep_cache_patterns';
  if (!db) {
    return LOCAL_PATTERNS;
  }

  try {
    const patternsRef = collection(db, 'patterns');
    const q = query(patternsRef, where('isPublished', '==', true), orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Fallback if DB is empty but supposed to have data, try cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
      return LOCAL_PATTERNS; 
    }

    const mappedPatterns = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        title: data.title,
        category: data.category as OrigamiPattern['category'],
        difficulty: data.difficulty as OrigamiPattern['difficulty'],
        estimatedTimeMinutes: data.estimatedTimeMinutes,
        totalSteps: data.totalSteps || 1, 
        paperSize: data.paperSize,
        paperTypeRecommendation: data.paperTypeRecommendation,
        description: data.description,
        tags: data.tags || [],
        isPublished: data.isPublished ?? true,
        isFeatured: data.isFeatured ?? false,
        imagePlaceholder: data.imagePlaceholder,
        imageUrl: data.imageUrl,
      };
    });

    // Cache the fresh data
    localStorage.setItem(CACHE_KEY, JSON.stringify(mappedPatterns));
    return mappedPatterns;

  } catch (err) {
    console.error('Error fetching patterns from Firebase, attempting cache fallback:', err);
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch(e) {}
    return LOCAL_PATTERNS; 
  }
}

export async function fetchPatternSteps(patternId: string): Promise<OrigamiStep[]> {
  const CACHE_KEY = `oristep_cache_steps_${patternId}`;
  
  if (!db) {
    const localPattern = LOCAL_PATTERNS.find(p => p.id === patternId);
    return localPattern?.steps || [];
  }

  try {
    const stepsRef = collection(db, 'pattern_steps');
    const q = query(stepsRef, where('patternId', '==', patternId), orderBy('stepNumber', 'asc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
      
      const localPattern = LOCAL_PATTERNS.find(p => p.id === patternId);
      return localPattern?.steps || [];
    }

    const mappedSteps = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        stepNumber: data.stepNumber,
        title: data.title,
        instruction: data.instruction,
        hint: data.hint || undefined,
        tip: data.tip || undefined,
        warning: data.warning || undefined,
        diagramPlaceholder: data.diagramPlaceholder || undefined,
      } as OrigamiStep;
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(mappedSteps));
    return mappedSteps;

  } catch (err) {
    console.error(`Error fetching steps for pattern ${patternId} from Firebase, attempting cache fallback:`, err);
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch(e) {}
    
    const localPattern = LOCAL_PATTERNS.find(p => p.id === patternId);
    return localPattern?.steps || [];
  }
}

export async function fetchPrivacyPolicy(): Promise<string | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'settings', 'privacy_policy');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().content || null;
    }
    return null;
  } catch (err) {
    console.error('Error fetching privacy policy from Firebase:', err);
    return null;
  }
}
