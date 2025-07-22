import { Translations } from '../types/index';

export class NotificationManager {
  private static permissionGranted = false;

  static checkPermission(): boolean {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    return Notification.permission === 'granted';
  }

  static async requestPermission(t: Translations): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log(t.notSupported);
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';

      if (this.permissionGranted) {
        this.sendTestNotification(t);
      }

      return this.permissionGranted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private static async sendTestNotification(t: Translations): Promise<void> {
    try {
      const notification = new Notification(t.notificationReady, {
        body: t.notificationReadyBody,
        icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f345.png'
      });

      setTimeout(() => notification.close(), 3000);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  static async sendNotification(title: string, message: string): Promise<void> {
    if (!this.checkPermission()) {
      console.log('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        body: message,
        icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f345.png',
        requireInteraction: true
      });

      notification.onclick = function() {
        window.focus();
        this.close();
      };

      // 播放提示音
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-notification-306.mp3');
      await audio.play().catch(e => console.log('Cannot play sound:', e));

      setTimeout(() => notification.close(), 10000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
} 