import SettingsLayout from "@/components/settings/SettingsLayout";
import NotificationSettings from "@/components/settings/NotificationSettings";

const AccountNotifications = () => {
  return (
    <SettingsLayout title="Notification Settings">
      <NotificationSettings />
    </SettingsLayout>
  );
};

export default AccountNotifications;