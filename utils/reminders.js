import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const REMINDER_ID_KEY = 'intento-daily-reminder';

export async function requestNotificationPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Menjadwalkan notifikasi pengingat harian pada jam tertentu.
 * @param {number} hour 0-23
 * @param {number} minute 0-59
 */
export async function scheduleDailyReminder(hour, minute) {
  // Hapus reminder lama dulu supaya tidak dobel
  await cancelDailyReminder();

  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID_KEY,
    content: {
      title: 'Waktunya latihan bicara 🎙️',
      body: 'Jaga intensimu tetap hidup — luangkan beberapa menit untuk speaking practice hari ini.',
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
  return true;
}

export async function cancelDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID_KEY).catch(() => {});
}

export function formatHourMinute(hour, minute) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`;
}
