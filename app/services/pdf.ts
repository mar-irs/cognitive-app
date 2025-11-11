import * as FileSystem from 'expo-file-system';
import { ActivityOutcome } from '@/state/scores';

export const generateCsvReport = async (history: ActivityOutcome[]) => {
  const header = 'date,activity,domain,level,score\n';
  const rows = history
    .slice(0, 50)
    .map((entry) =>
      [entry.timestamp, entry.activityId, entry.domain, entry.level, entry.result.score.toFixed(2)].join(',')
    )
    .join('\n');
  const content = `${header}${rows}`;
  const uri = `${FileSystem.cacheDirectory}mindmosaic-report.csv`;
  await FileSystem.writeAsStringAsync(uri, content, { encoding: FileSystem.EncodingType.UTF8 });
  return uri;
};

export const generatePdfSummary = async (history: ActivityOutcome[]) => {
  const summary = history
    .slice(0, 10)
    .map((entry) => `${entry.timestamp.slice(0, 10)} • ${entry.activityId} • ${(entry.result.score * 100).toFixed(0)}%`)
    .join('\n');
  const uri = `${FileSystem.cacheDirectory}mindmosaic-summary.txt`;
  await FileSystem.writeAsStringAsync(uri, `MindMosaic Summary\n${summary}`);
  return uri;
};
