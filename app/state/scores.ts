import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/services/storage';
import { NormalizedResult } from '@/activities/types';
import { updateScores } from '@/adaptive/engine';

export type Domain = 'attention' | 'memory' | 'language' | 'executive' | 'speed';

export interface CognitiveScores {
  attention: number;
  memory: number;
  language: number;
  executive: number;
  speed: number;
}

export interface ActivityOutcome {
  activityId: string;
  domain: Domain;
  level: number;
  result: NormalizedResult;
  timestamp: string;
}

interface ScoresStore {
  scores: CognitiveScores;
  history: ActivityOutcome[];
  recordOutcome: (outcome: ActivityOutcome) => void;
  reset: () => void;
}

const baseline: CognitiveScores = {
  attention: 100,
  memory: 100,
  language: 100,
  executive: 100,
  speed: 100
};

export const useScoresStore = create<ScoresStore>()(
  persist(
    (set, get) => ({
      scores: baseline,
      history: [],
      recordOutcome: (outcome) => {
        const updatedScores = updateScores(get().scores, outcome);
        set({ scores: updatedScores, history: [outcome, ...get().history].slice(0, 1000) });
      },
      reset: () => set({ scores: baseline, history: [] })
    }),
    {
      name: 'mindmosaic-scores',
      getStorage: () => storage
    }
  )
);
