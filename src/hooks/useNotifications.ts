import { useNotificationContext } from '@/contexts/NotificationContext';

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment';
  title: string;
  message: string;
  milk_test_id?: string;
  triggered_by_user_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  likes_enabled: boolean;
  comments_enabled: boolean;
  newsletter_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  return useNotificationContext();
}

export function useNotificationPreferences() {
  const { preferences, preferencesLoading, updatePreferences } = useNotificationContext();
  return { preferences, loading: preferencesLoading, updatePreferences };
}
