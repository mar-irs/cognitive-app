import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSettingsStore } from '@/state/settings';
import { useTranslation } from 'react-i18next';
import { LargeButton } from '@/components/LargeButton';
import { useProfileStore } from '@/state/profile';
import { useSessionStore } from '@/state/session';
import { useScoresStore } from '@/state/scores';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { t } = useTranslation();
  const clearProfile = useProfileStore((state) => state.clear);
  const resetSession = useSessionStore((state) => state.reset);
  const resetScores = useScoresStore((state) => state.reset);

  const handleClearData = () => {
    clearProfile();
    resetSession();
    resetScores();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#FFFFFF', gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{t('settings.title', 'Settings')}</Text>
      <View style={{ backgroundColor: '#F5F8FF', borderRadius: 20, padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{t('settings.accessibility', 'Accessibility')}</Text>
        <Pressable
          onPress={() => updateSettings({ contrast: settings.contrast === 'high' ? 'standard' : 'high' })}
          accessibilityRole="switch"
          accessibilityState={{ checked: settings.contrast === 'high' }}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18 }}>{t('settings.highContrast', 'High contrast')}</Text>
          <Text>{settings.contrast === 'high' ? 'On' : 'Off'}</Text>
        </Pressable>
        <Pressable
          onPress={() => updateSettings({ haptics: !settings.haptics })}
          accessibilityRole="switch"
          accessibilityState={{ checked: settings.haptics }}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18 }}>{t('settings.haptics', 'Gentle vibrations')}</Text>
          <Text>{settings.haptics ? 'On' : 'Off'}</Text>
        </Pressable>
        <Pressable
          onPress={() => updateSettings({ voiceGuidance: !settings.voiceGuidance })}
          accessibilityRole="switch"
          accessibilityState={{ checked: settings.voiceGuidance }}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18 }}>{t('settings.voice', 'Voice guidance')}</Text>
          <Text>{settings.voiceGuidance ? 'On' : 'Off'}</Text>
        </Pressable>
      </View>
      <View style={{ backgroundColor: '#F5F8FF', borderRadius: 20, padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{t('settings.data', 'Data & Privacy')}</Text>
        <Text style={{ fontSize: 16 }}>{t('settings.privacy', 'MindMosaic stores data on this device only. You can clear it anytime.')}</Text>
        <LargeButton label={t('settings.clear', 'Clear my data')} onPress={handleClearData} />
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
