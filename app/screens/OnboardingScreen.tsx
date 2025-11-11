import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';
import { LargeButton } from '@/components/LargeButton';
import { useProfileStore } from '@/state/profile';
import { useSettingsStore } from '@/state/settings';
import { useTranslation } from 'react-i18next';
import { InstructionCard } from '@/components/InstructionCard';
import { v4 as uuidv4 } from 'uuid';
import i18n from '@/services/i18n';

const ageRanges: Array<{ label: string; value: '55-64' | '65-74' | '75-84' | '85+' }> = [
  { label: '55-64', value: '55-64' },
  { label: '65-74', value: '65-74' },
  { label: '75-84', value: '75-84' },
  { label: '85+', value: '85+' }
];

export type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<OnboardingProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState<'55-64' | '65-74' | '75-84' | '85+' | undefined>();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [visionSupport, setVisionSupport] = useState(false);
  const [hearingSupport, setHearingSupport] = useState(false);
  const setProfile = useProfileStore((state) => state.setProfile);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const handleContinue = () => {
    if (!ageRange) return;
    setProfile({
      id: uuidv4(),
      name,
      ageRange,
      language,
      visionSupport,
      hearingSupport,
      createdAt: new Date().toISOString()
    });
    i18n.changeLanguage(language);
    updateSettings({
      fontScale: visionSupport ? 1.3 : 1,
      voiceGuidance: hearingSupport ? false : true
    });
    navigation.replace('Main');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, padding: width > 600 ? 48 : 24, gap: 24 }}>
        <InstructionCard
          title={t('onboarding.title', 'Welcome to MindMosaic')}
          description={t(
            'onboarding.description',
            'MindMosaic keeps your mind sharp with gentle daily activities. This is not a medical device.'
          )}
        />
        <View style={{ backgroundColor: '#F7F9FF', borderRadius: 20, padding: 24, gap: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>{t('onboarding.profile', 'Your Profile')}</Text>
          <Text accessibilityRole="text">{t('onboarding.name', 'What should we call you?')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('onboarding.namePlaceholder', 'Name (optional)')}
            style={{
              borderWidth: 1,
              borderColor: '#CBD4FF',
              borderRadius: 12,
              padding: 16,
              fontSize: 20
            }}
          />
          <Text>{t('onboarding.age', 'Age range')}</Text>
          <View style={{ flexDirection: width > 600 ? 'row' : 'column', gap: 12 }}>
            {ageRanges.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: ageRange === option.value }}
                onPress={() => setAgeRange(option.value)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: ageRange === option.value ? '#2F6BFF' : '#CBD4FF'
                }}
              >
                <Text style={{ fontSize: 18 }}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
          <Text>{t('onboarding.language', 'Preferred language')}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { label: 'English', value: 'en' as const },
              { label: 'Español', value: 'es' as const }
            ].map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: language === option.value }}
                onPress={() => setLanguage(option.value)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: language === option.value ? '#2F6BFF' : '#CBD4FF'
                }}
              >
                <Text style={{ fontSize: 18 }}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => setVisionSupport((prev) => !prev)}
            accessibilityRole="switch"
            accessibilityState={{ checked: visionSupport }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                backgroundColor: visionSupport ? '#2F6BFF' : '#CBD4FF',
                padding: 4,
                alignItems: visionSupport ? 'flex-end' : 'flex-start'
              }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
            </View>
            <Text style={{ fontSize: 18 }}>{t('onboarding.vision', 'I need larger text')}</Text>
          </Pressable>
          <Pressable
            onPress={() => setHearingSupport((prev) => !prev)}
            accessibilityRole="switch"
            accessibilityState={{ checked: hearingSupport }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                backgroundColor: hearingSupport ? '#2F6BFF' : '#CBD4FF',
                padding: 4,
                alignItems: hearingSupport ? 'flex-end' : 'flex-start'
              }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
            </View>
            <Text style={{ fontSize: 18 }}>{t('onboarding.hearing', 'I prefer captions only')}</Text>
          </Pressable>
        </View>
        <LargeButton
          label={t('onboarding.begin', 'Start baseline assessment')}
          onPress={handleContinue}
          disabled={!ageRange}
        />
      </View>
    </ScrollView>
  );
};

export default OnboardingScreen;
