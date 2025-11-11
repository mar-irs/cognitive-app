import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';
import { getActivityById } from '@/activities/registry';
import { useSettingsStore } from '@/state/settings';
import { useSessionStore } from '@/state/session';
import { decideNextDifficulty } from '@/adaptive/engine';
import { RawOutcome } from '@/activities/types';

export type ActivityScreenProps = NativeStackScreenProps<RootStackParamList, 'Activity'>;

const ActivityScreen: React.FC<ActivityScreenProps> = ({ route, navigation }) => {
  const { activityId, level = 1, practice } = route.params;
  const activity = getActivityById(activityId);
  const settings = useSettingsStore((state) => state.settings);
  const { width } = useWindowDimensions();
  const updateItem = useSessionStore((state) => state.updateItem);

  if (!activity) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Activity not found.</Text>
      </View>
    );
  }

  const formFactor = width > 600 ? 'tablet' : 'phone';
  const element = activity.run(level, settings, formFactor) as React.ReactElement<any>;

  const afterComplete = (outcome: RawOutcome) => {
    if (practice) {
      navigation.goBack();
      return;
    }
    const normalized = activity.evaluate(outcome);
    const decision = decideNextDifficulty(level, normalized);
    updateItem(activityId, 'completed', decision.nextLevel);
    navigation.navigate('Results');
  };

  return React.cloneElement(element, { practice, afterComplete });
};

export default ActivityScreen;
