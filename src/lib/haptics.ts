import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const hapticImpact = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (e) {
      console.warn('Haptics not supported or failed', e);
    }
  }
};

export const hapticSuccess = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch (err) {
        console.warn('Haptics not supported', err);
      }
    }
  }
};

export const hapticError = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (e) {
      console.warn('Haptics not supported', e);
    }
  }
};
