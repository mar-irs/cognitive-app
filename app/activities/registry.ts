import { ActivitySpec } from './types';
import { oddOneOut } from './oddOneOut';
import { goNoGo } from './goNoGo';
import { nBack } from './nBack';
import { picturePairs } from './picturePairs';
import { trailMaking } from './trailMaking';
import { symbolMatch } from './symbolMatch';
import { wordMatch } from './wordMatch';

export const activities: ActivitySpec[] = [oddOneOut, goNoGo, nBack, picturePairs, wordMatch, trailMaking, symbolMatch];

export const getActivityById = (id: string): ActivitySpec | undefined => activities.find((activity) => activity.id === id);
