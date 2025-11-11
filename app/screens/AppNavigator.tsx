import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/state/profile';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import ActivityScreen from './ActivityScreen';
import ResultsScreen from './ResultsScreen';
import SettingsScreen from './SettingsScreen';
import ReportsScreen from './ReportsScreen';
import { ThemedIcon } from '@/components/ThemedIcon';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Activity: { activityId: string; level?: number; practice?: boolean };
  Results: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: { paddingVertical: 4, height: 64 },
        tabBarActiveTintColor: '#2F6BFF',
        tabBarAccessibilityLabel: t('nav.tabs.accessibilityLabel')
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color, size }) => <ThemedIcon name="home" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: t('nav.reports'),
          tabBarIcon: ({ color, size }) => <ThemedIcon name="trending-up" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color, size }) => <ThemedIcon name="settings" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const profile = useProfileStore((state) => state.profile);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!profile ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
