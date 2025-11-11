import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LargeButton } from '@/components/LargeButton';
import { useScoresStore } from '@/state/scores';
import { useTranslation } from 'react-i18next';

const ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { history } = useScoresStore();
  const latest = history[0];
  const { t } = useTranslation();

  if (!latest) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{t('results.none', 'No results yet')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 32, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: '700' }}>{t('results.title', 'Great work!')}</Text>
        <View style={{ backgroundColor: '#F5F8FF', padding: 24, borderRadius: 20, width: '100%', maxWidth: 480 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>{latest.activityId}</Text>
          <Text style={{ fontSize: 18, marginTop: 12 }}>
            {t('results.accuracy', 'Accuracy')}: {Math.round(latest.result.accuracy * 100)}%
          </Text>
          <Text style={{ fontSize: 18, marginTop: 4 }}>
            {t('results.speed', 'Speed factor')}: {latest.result.speedFactor.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 18, marginTop: 4 }}>
            {t('results.level', 'Next suggested level')}: {latest.level}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <LargeButton label={t('results.home', 'Back to home')} onPress={() => navigation.navigate('Main' as never)} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ResultsScreen;
