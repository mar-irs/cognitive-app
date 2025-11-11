import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/services/storage';
import { ActivitySpec } from '@/activities/types';
import { activities } from '@/activities/registry';
import { buildDailyPlan } from '@/adaptive/dailyPlan';
import { useProfileStore } from './profile';
import { useScoresStore } from './scores';

export interface PlanItem {
  activityId: string;
  level: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface SessionStore {
  currentPlan?: PlanItem[];
  ensurePlan: () => void;
  updateItem: (activityId: string, status: PlanItem['status'], level?: number) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      currentPlan: undefined,
      ensurePlan: () => {
        if (!get().currentPlan) {
          const profile = useProfileStore.getState().profile;
          const scores = useScoresStore.getState().scores;
          const plan = buildDailyPlan(profile, scores, activities as ActivitySpec[]);
          set({ currentPlan: plan });
        }
      },
      updateItem: (activityId, status, level) => {
        const plan = get().currentPlan;
        if (!plan) return;
        set({
          currentPlan: plan.map((item) =>
            item.activityId === activityId ? { ...item, status, level: level ?? item.level } : item
          )
        });
      },
      reset: () => set({ currentPlan: undefined })
    }),
    {
      name: 'mindmosaic-session',
      getStorage: () => storage
    }
  )
);
