import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        reports: 'Reports',
        settings: 'Settings',
        tabs: { accessibilityLabel: 'Navigation tabs' }
      },
      onboarding: {
        title: 'Welcome to MindMosaic',
        description: 'MindMosaic keeps your mind sharp with gentle daily activities. This is not a medical device.',
        profile: 'Your Profile',
        name: 'What should we call you?',
        namePlaceholder: 'Name (optional)',
        age: 'Age range',
        language: 'Preferred language',
        vision: 'I need larger text',
        hearing: 'I prefer captions only',
        begin: 'Start baseline assessment'
      },
      home: {
        greeting: 'Hello',
        today: "Today's Mosaic",
        subtitle: 'Three bite-sized activities to keep your mind bright.',
        start: 'Start',
        completed: 'Done',
        weeklyProgress: 'Weekly progress'
      },
      domains: {
        attention: 'Attention',
        memory: 'Memory',
        language: 'Language',
        executive: 'Executive',
        speed: 'Processing speed'
      },
      results: {
        title: 'Great work!',
        none: 'No results yet',
        accuracy: 'Accuracy',
        speed: 'Speed factor',
        level: 'Next suggested level',
        home: 'Back to home'
      },
      settings: {
        title: 'Settings',
        accessibility: 'Accessibility',
        highContrast: 'High contrast',
        haptics: 'Gentle vibrations',
        voice: 'Voice guidance',
        data: 'Data & Privacy',
        privacy: 'MindMosaic stores data on this device only. You can clear it anytime.',
        clear: 'Clear my data'
      },
      reports: {
        title: 'Weekly Review',
        summary: 'Plain-language summary',
        copy: 'Your attention is improving. Keep practicing daily for steady progress. Remember to take breaks and stay hydrated.',
        export: 'Export CSV / PDF',
        exporting: 'Preparing…',
        exportTitle: 'Export ready',
        csv: 'CSV',
        pdf: 'Summary',
        error: 'Unable to export'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        reports: 'Reportes',
        settings: 'Ajustes',
        tabs: { accessibilityLabel: 'Pestañas de navegación' }
      }
    }
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: Localization.locale.startsWith('es') ? 'es' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
