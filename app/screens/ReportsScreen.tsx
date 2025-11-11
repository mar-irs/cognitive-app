import React, { useState } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';
import { useScoresStore } from '@/state/scores';
import { aggregateWeekly } from '@/adaptive/engine';
import { generateCsvReport, generatePdfSummary } from '@/services/pdf';
import { LargeButton } from '@/components/LargeButton';
import { useTranslation } from 'react-i18next';

const domains: Array<{ key: 'attention' | 'memory' | 'language' | 'executive' | 'speed'; label: string }> = [
  { key: 'attention', label: 'Attention' },
  { key: 'memory', label: 'Memory' },
  { key: 'language', label: 'Language' },
  { key: 'executive', label: 'Executive' },
  { key: 'speed', label: 'Processing Speed' }
];

const ReportsScreen: React.FC = () => {
  const { scores, history } = useScoresStore();
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const csvPath = await generateCsvReport(history);
      const pdfPath = await generatePdfSummary(history);
      Alert.alert(t('reports.exportTitle', 'Export ready'), `${t('reports.csv', 'CSV')}: ${csvPath}\n${t('reports.pdf', 'Summary')}: ${pdfPath}`);
    } catch (error) {
      Alert.alert(t('reports.error', 'Unable to export'), String(error));
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#FFFFFF', gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{t('reports.title', 'Weekly Review')}</Text>
      <View style={{ backgroundColor: '#F5F8FF', borderRadius: 20, padding: 20, gap: 16 }}>
        {domains.map((domain) => {
          const summary = aggregateWeekly(history, domain.key);
          const delta = summary.trend;
          const arrow = delta > 0.02 ? '⬆️' : delta < -0.02 ? '⬇️' : '➡️';
          return (
            <View key={domain.key} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18 }}>{t(`domains.${domain.key}`, domain.label)}</Text>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>
                {(scores[domain.key] ?? 0).toFixed(0)} {arrow}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={{ backgroundColor: '#F5F8FF', borderRadius: 20, padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{t('reports.summary', 'Plain-language summary')}</Text>
        <Text style={{ fontSize: 18 }}>
          {t(
            'reports.copy',
            'Your attention is improving. Keep practicing daily for steady progress. Remember to take breaks and stay hydrated.'
          )}
        </Text>
      </View>
      <LargeButton label={exporting ? t('reports.exporting', 'Preparing…') : t('reports.export', 'Export CSV / PDF')} onPress={handleExport} disabled={exporting} />
    </ScrollView>
  );
};

export default ReportsScreen;
