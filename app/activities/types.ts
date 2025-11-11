import { UserSettings } from '@/state/settings';

export type Domain = 'attention' | 'memory' | 'language' | 'executive' | 'speed';

export interface RawOutcome {
  accuracy: number;
  reactionTime: number;
  errors: number;
  completed: boolean;
}

export interface NormalizedResult {
  score: number; // 0..1
  accuracy: number;
  speedFactor: number;
  errorRate: number;
}

export interface ActivityLevel {
  id: number;
  durationSeconds: number;
  targetAccuracy: number;
  description: string;
}

export interface ActivitySpec {
  id: string;
  domain: Domain;
  title: string;
  instructions: string;
  practiceEnabled: boolean;
  levels: ActivityLevel[];
  run: (level: number, settings: UserSettings, formFactor: 'phone' | 'tablet') => JSX.Element;
  evaluate: (outcome: RawOutcome) => NormalizedResult;
}
