import React, { useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LargeButton } from '@/components/LargeButton';
import { ProgressRing } from '@/components/ProgressRing';
import { useSessionStore } from '@/state/session';
import { useScoresStore } from '@/state/scores';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/state/profile';
import { getActivityById } from '@/activities/registry';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const ensurePlan = useSessionStore((state) => state.ensurePlan);
  const plan = useSessionStore((state) => state.currentPlan);
  const updateItem = useSessionStore((state) => state.updateItem);
  const { scores } = useScoresStore();
  const { t } = useTranslation();
  const profile = useProfileStore((state) => state.profile);
  const { width } = useWindowDimensions();

  useEffect(() => {
    ensurePlan();
  }, [ensurePlan]);

  const completedCount = plan?.filter((item) => item.status === 'completed').length ?? 0;
  const progress = plan && plan.length > 0 ? completedCount / plan.length : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ padding: width > 600 ? 48 : 24, gap: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: '700' }}>
        {t('home.greeting', 'Hello')}{profile?.name ? `, ${profile.name}` : ''}
      </Text>
      <View
        style={{
          backgroundColor: '#F5F8FF',
          borderRadius: 20,
          padding: 24,
          flexDirection: width > 900 ? 'row' : 'column',
          alignItems: 'center',
          gap: 24
        }}
      >
        <ProgressRing progress={progress} label={`${Math.round(progress * 100)}%`} />
        <View style={{ flex: 1, gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700' }}>{t('home.today', "Today's Mosaic")}</Text>
          <Text style={{ fontSize: 18 }}>
            {t('home.subtitle', 'Three bite-sized activities to keep your mind bright.')}
          </Text>
          {plan?.map((item) => {
            const activity = getActivityById(item.activityId);
            if (!activity) return null;
            return (
              <View
                key={item.activityId}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#D8E0FF',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700' }}>{activity.title}</Text>
                  <Text style={{ fontSize: 16, marginTop: 4 }}>{t(`domains.${activity.domain}`, activity.domain)}</Text>
                </View>
                <LargeButton
                  label={item.status === 'completed' ? t('home.completed', 'Done') : t('home.start', 'Start')}
                  onPress={() => {
                    updateItem(item.activityId, 'in-progress');
                    navigation.navigate('Activity' as never, { activityId: item.activityId, level: item.level } as never);
                  }}
                  disabled={item.status === 'completed'}
                />
              </View>
            );
          })}
        </View>
      </View>
      <View style={{ backgroundColor: '#F5F8FF', borderRadius: 20, padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>{t('home.weeklyProgress', 'Weekly progress')}</Text>
        {Object.entries(scores).map(([domain, value]) => (
          <View
            key={domain}
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
            accessibilityRole="text"
          >
            <Text style={{ fontSize: 18 }}>{t(`domains.${domain}`, domain)}</Text>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{Math.round(value)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
