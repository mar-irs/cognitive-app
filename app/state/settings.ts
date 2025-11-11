import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/services/storage';

export interface UserSettings {
  fontScale: number;
  contrast: 'standard' | 'high';
  sound: boolean;
  haptics: boolean;
  voiceGuidance: boolean;
  reducedMotion: boolean;
  reminderTime: string;
}

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  fontScale: 1,
  contrast: 'standard',
  sound: true,
  haptics: true,
  voiceGuidance: true,
  reducedMotion: false,
  reminderTime: '09:00'
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (next) => set((state) => ({ settings: { ...state.settings, ...next } }))
    }),
    {
      name: 'mindmosaic-settings',
      getStorage: () => storage
    }
  )
);
