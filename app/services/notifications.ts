import * as Notifications from 'expo-notifications';

export const scheduleDailyReminder = async (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MindMosaic',
      body: 'Your daily mosaic is ready when you are.'
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true
    }
  });
};
