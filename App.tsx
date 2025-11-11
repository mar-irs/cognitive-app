import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { TailwindProvider } from 'nativewind';
import AppNavigator from './app/screens/AppNavigator';
import i18n from './app/services/i18n';
import { AccessibilityAnnouncer } from './app/a11y/AccessibilityAnnouncer';
import { useInitTheme } from './app/theme/init';

export default function App() {
  const scheme = useColorScheme();
  useInitTheme();

  return (
    <I18nextProvider i18n={i18n}>
      <TailwindProvider>
        <SafeAreaProvider>
          <AccessibilityAnnouncer>
            <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
              <AppNavigator />
            </NavigationContainer>
          </AccessibilityAnnouncer>
        </SafeAreaProvider>
      </TailwindProvider>
    </I18nextProvider>
  );
}
