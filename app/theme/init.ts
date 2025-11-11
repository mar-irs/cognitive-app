import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';

/**
 * Ensures we respect user theme preferences on launch.
 */
export const useInitTheme = () => {
  const scheme = useColorScheme();
  useEffect(() => {
    if (scheme) {
      SystemUI.setBackgroundColorAsync(scheme === 'dark' ? '#0B0E16' : '#F6F8FB');
    }
  }, [scheme]);
};
