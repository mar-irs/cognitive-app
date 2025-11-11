import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/services/storage';

export interface UserProfile {
  id: string;
  name?: string;
  ageRange: '55-64' | '65-74' | '75-84' | '85+';
  language: 'en' | 'es';
  visionSupport: boolean;
  hearingSupport: boolean;
  createdAt: string;
}

interface ProfileStore {
  profile?: UserProfile;
  setProfile: (profile: UserProfile) => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: undefined,
      setProfile: (profile) => set({ profile }),
      clear: () => set({ profile: undefined })
    }),
    {
      name: 'mindmosaic-profile',
      getStorage: () => storage
    }
  )
);
